// src/stores/user.ts

import { defineStore } from 'pinia'
import type { User, Roadmap, Content, Step } from '@/types/collections'

export const useUserStore = defineStore('user', {
  state: () => ({
    // Si un token existe dans localStorage, on l'utilise
    token: (localStorage.getItem('token') ?? '') as string,
    profile: null as User | null,
    roadmapsCreated: [] as Roadmap[],
    bookmarks: [] as Roadmap[],
    contentsCreated: [] as Content[],
    stepsCreated: [] as Step[],
  }),
  actions: {
    setToken(t: string) {
      this.token = t
      localStorage.setItem('token', t)
    },
    clear() {
      this.token = ''
      this.profile = null
      this.bookmarks = []
      this.roadmapsCreated = []
      this.contentsCreated = []
      this.stepsCreated = []
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
      // après avoir chargé le profile, charger les roadmaps créées
      await this.fetchUserRoadmaps()
      await this.fetchUserBookmarks()
      await this.fetchUserSteps()
      await this.fetchUserContents()
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
      // 1) Appel à l’API pour supprimer la roadmap
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

      // 2) Met à jour le tableau d’IDs dans le profile
      if (this.profile) {
        this.profile.RoadmapsCreated = this.profile.RoadmapsCreated.filter((rid) => rid !== id)
      }

      // 3) Met à jour le state des objets chargés
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
        console.log(promises)
      } catch {
        this.bookmarks = []
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
        this.profile.ContentsCreated = this.profile.ContentsCreated.filter((rid) => rid !== id)
      }

      // 3) Met à jour le state des objets chargés
      this.contentsCreated = this.contentsCreated.filter((rm) => rm.id !== id)
    },
  },
})
