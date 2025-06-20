// src/stores/user.ts

import { defineStore } from 'pinia'
import type { User, Roadmap, Content, Step, Game, Guide, Attachment } from '@/types/collections'

export const useUserStore = defineStore('user', {
  state: () => ({
    // Si un token existe dans localStorage, on l'utilise
    token: (localStorage.getItem('token') ?? '') as string,
    profile: null as User | null,
    games: [] as Game[],
    roadmapsCreated: [] as Roadmap[],
    bookmarks: [] as Roadmap[],
    contentsCreated: [] as Content[],
    stepsCreated: [] as Step[],
    guidesCreated: [] as Guide[],
    attachmentsCreated: [] as Attachment[],
  }),
  actions: {
    setToken(t: string) {
      this.token = t
      localStorage.setItem('token', t)
    },
    clear() {
      this.token = ''
      this.profile = null
      this.games = []
      this.bookmarks = []
      this.roadmapsCreated = []
      this.contentsCreated = []
      this.stepsCreated = []
      this.guidesCreated = []
      this.attachmentsCreated = []
      this.games = []
      localStorage.removeItem('token')
    },
    async fetchProfile() {
      if (!this.token) return
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/user/profile`,
          { headers: { Authorization: `Bearer ${this.token}` } },
        )
        if (res.ok) {
          this.profile = await res.json()
        } else {
          // token invalide, on efface
          this.clear()
        }
      } catch {
        this.clear()
      }
      // après avoir chargé le profile, charger les élément créés
      await this.fetchUserRoadmaps()
      await this.fetchUserBookmarks()
      await this.fetchUserSteps()
      await this.fetchUserContents()
      await this.fetchUserGuides()
      await this.fetchUserAttachments()
      await this.fetchAllGames()
    },
    // Récupère tous les jeux (GET /games)
    async fetchAllGames() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/games`,
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        this.games = (await res.json()) as Game[]
      } catch {
        this.games = []
      }
    },
    /**
     * Récupère toutes les roadmaps dont l'utilisateur est l'auteur
     * en interrogeant /roadmap/{id} pour chaque id.
     */
    async fetchUserRoadmaps() {
      if (!this.profile?.RoadmapsCreated?.length) {
        this.roadmapsCreated = []
        return
      }
      const promises = this.profile.RoadmapsCreated.map((id) =>
        fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${id}`,
        ).then((res) => (res.ok ? (res.json() as Promise<Roadmap>) : Promise.reject())),
      )
      try {
        this.roadmapsCreated = await Promise.all(promises)
      } catch {
        this.roadmapsCreated = []
      }
    },
    /**
     * Supprime une roadmap :
     * - Appel DELETE /roadmap/{id}
     * - Met à jour le state pour retirer l’id et l’objet correspondant
     */
    async deleteRoadmap(id: string) {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${this.token}` },
        },
      )
      if (!res.ok) {
        throw new Error(`Suppression échouée (${res.status})`)
      }

      if (this.profile) {
        this.profile.RoadmapsCreated = this.profile.RoadmapsCreated.filter((rid) => rid !== id)
      }

      this.roadmapsCreated = this.roadmapsCreated.filter((rm) => rm.id !== id)
    },
    /**
     * Récupère toutes les bookmarks dont l'utilisateur est l'auteur
     * en interrogeant /roadmap/{id} pour chaque id.
     */
    async fetchUserBookmarks() {
      if (!this.profile?.Bookmarks?.length) {
        this.bookmarks = []
        return
      }
      const promises = this.profile.Bookmarks.map((id) =>
        fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${id}`,
        ).then((res) => (res.ok ? (res.json() as Promise<Roadmap>) : Promise.reject())),
      )
      try {
        this.bookmarks = await Promise.all(promises)
      } catch {
        this.bookmarks = []
      }
    },
    addToBookmarks(roadmap: Roadmap) {
      // Ajouter l'ID aux bookmarks du profil si pas déjà présent
      if (this.profile && !this.profile.Bookmarks.includes(roadmap.id)) {
        this.profile.Bookmarks.push(roadmap.id)
      }

      // Ajouter la roadmap aux bookmarks si pas déjà présente
      if (!this.bookmarks.some((bookmark) => bookmark.id === roadmap.id)) {
        this.bookmarks.push(roadmap)
      }
    },
    removeFromBookmarks(roadmapId: string) {
      // Retirer l'ID des bookmarks du profil
      if (this.profile) {
        this.profile.Bookmarks = this.profile.Bookmarks.filter((id) => id !== roadmapId)
      }

      // Retirer la roadmap des bookmarks
      this.bookmarks = this.bookmarks.filter((bookmark) => bookmark.id !== roadmapId)
    },
    async toggleBookmark(roadmap: Roadmap) {
      if (!this.profile) return { success: false, error: 'User not connected' }

      const isCurrentlyBookmarked = this.bookmarks.some((bookmark) => bookmark.id === roadmap.id)
      const method = isCurrentlyBookmarked ? 'DELETE' : 'PUT'

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/user/bookmarks`,
          {
            method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify({ roadmapId: roadmap.id }),
          },
        )

        if (response.ok) {
          // Mettre à jour le store localement selon l'action
          if (isCurrentlyBookmarked) {
            this.removeFromBookmarks(roadmap.id)
          } else {
            this.addToBookmarks(roadmap)
          }

          return {
            success: true,
            isBookmarked: !isCurrentlyBookmarked,
            action: isCurrentlyBookmarked ? 'removed' : 'added',
          }
        } else {
          const errorText = await response.text()
          return {
            success: false,
            error: `API Error: ${errorText}`,
          }
        }
      } catch (error) {
        return {
          success: false,
          error: `Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }
      }
    },
    async fetchUserSteps() {
      if (!this.profile?.StepsCreated?.length) {
        this.stepsCreated = []
        return
      }
      const promises = this.profile.StepsCreated.map((id) =>
        fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/step/${id}`).then(
          (res) => (res.ok ? (res.json() as Promise<Step>) : Promise.reject()),
        ),
      )
      try {
        this.stepsCreated = await Promise.all(promises)
      } catch {
        this.stepsCreated = []
      }
    },
    async deleteStep(id: string) {
      // 1) Appel à l’API pour supprimer le contenu
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/step/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${this.token}` },
        },
      )
      if (!res.ok) {
        throw new Error(`Suppression échouée (${res.status})`)
      }

      // 2) Met à jour le tableau d’IDs dans le profile
      if (this.profile) {
        this.profile.StepsCreated = this.profile.StepsCreated.filter((sid) => sid !== id)
      }

      // 3) Met à jour le state des objets chargés
      this.stepsCreated = this.stepsCreated.filter((sm) => sm.id !== id)
    },
    /**
     * Récupère toutes les contenus dont l'utilisateur est l'auteur
     * en interrogeant /content/{id} pour chaque id.
     */
    async fetchUserContents() {
      if (!this.profile?.ContentsCreated?.length) {
        this.contentsCreated = []
        return
      }
      const promises = this.profile.ContentsCreated.map((id) =>
        fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/content/${id}`,
        ).then((res) => (res.ok ? (res.json() as Promise<Content>) : Promise.reject())),
      )
      try {
        this.contentsCreated = await Promise.all(promises)
      } catch {
        this.contentsCreated = []
      }
    },
    /**
     * Supprime un contenu :
     * - Appel DELETE /content/{id}
     * - Met à jour le state pour retirer l’id et l’objet correspondant
     */
    async deleteContent(id: string) {
      // 1) Appel à l’API pour supprimer le contenu
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/content/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${this.token}` },
        },
      )
      if (!res.ok) {
        throw new Error(`Suppression échouée (${res.status})`)
      }

      // 2) Met à jour le tableau d’IDs dans le profile
      if (this.profile) {
        this.profile.ContentsCreated = this.profile.ContentsCreated.filter((cid) => cid !== id)
      }

      // 3) Met à jour le state des objets chargés
      this.contentsCreated = this.contentsCreated.filter((c) => c.id !== id)
    },
    async fetchUserGuides() {
      if (!this.profile?.GuidesCreated?.length) {
        this.guidesCreated = []
        return
      }
      const promises = this.profile.GuidesCreated.map((id) =>
        fetch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/guide/${id}`).then(
          (res) => (res.ok ? (res.json() as Promise<Guide>) : Promise.reject()),
        ),
      )
      try {
        this.guidesCreated = await Promise.all(promises)
      } catch {
        this.guidesCreated = []
      }
    },
    async deleteGuide(id: string) {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/guide/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${this.token}` },
        },
      )
      if (!res.ok) {
        throw new Error(`Suppression échouée (${res.status})`)
      }

      // 2) Met à jour le tableau d’IDs dans le profile
      if (this.profile) {
        this.profile.GuidesCreated = this.profile.GuidesCreated.filter((gid) => gid !== id)
      }

      // 3) Met à jour le state des objets chargés
      this.guidesCreated = this.guidesCreated.filter((g) => g.id !== id)
    },
    async fetchUserAttachments() {
      if (!this.profile?.AttachmentsCreated?.length) {
        this.attachmentsCreated = []
        return
      }
      const promises = this.profile.AttachmentsCreated.map((id) =>
        fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/attachment/${id}`,
        ).then((res) => (res.ok ? (res.json() as Promise<Attachment>) : Promise.reject())),
      )
      try {
        this.attachmentsCreated = await Promise.all(promises)
      } catch {
        this.attachmentsCreated = []
      }
    },
    async deleteAttachment(id: string) {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/attachment/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${this.token}` },
        },
      )
      if (!res.ok) {
        throw new Error(`Suppression échouée (${res.status})`)
      }

      // 2) Met à jour le tableau d’IDs dans le profile
      if (this.profile) {
        this.profile.AttachmentsCreated = this.profile.AttachmentsCreated.filter(
          (aid) => aid !== id,
        )
      }

      // 3) Met à jour le state des objets chargés
      this.attachmentsCreated = this.attachmentsCreated.filter((a) => a.id !== id)
    },
  },
})
