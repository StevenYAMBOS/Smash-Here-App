<!--
src/views/Roadmaps/RoadmapsListView.vue

Composant qui affiche la liste des roadmaps d'un jeu
-->

<script setup lang="ts">
import { onMounted, onUnmounted ,reactive, computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import HeaderGame from '@/components/layout/HeaderGame.vue'
import RoadmapCard from '@/components/ui/RoadmapCard.vue'
import type { Game, Roadmap, User } from '@/types/collections'
import SearchBar from '@/components/ui/SearchBar.vue'
import { useUserStore } from '@/stores/user'
import { usePageTitle } from '@/composables/usePageTitle'

const route = useRoute()
const slug = route.params.slug as string
const userStore = useUserStore()
const { updateTitle, resetTitle } = usePageTitle()

const state = reactive({
  game: null as Game | null,
  roadmaps: [] as Roadmap[],
  bookmarks: [] as string[],
  authors: new Map<string, User>(),
  loading: true,
  error: '',
})

const fetchGameAndRoadmaps = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/games`,
    )
    const games = await res.json()

    // Retrouver le jeu depuis le slug
    const game = games.find(
      (g: Game) =>
        g.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '') === slug,
    )

    if (!game) {
      state.error = 'No game available.'
      return
    }

    state.game = game

    // Mettre à jour le titre avec le nom du jeu
    updateTitle(`${game.title} Roadmaps`)

    // Appel à l’API pour récupérer les roadmaps du jeu
    const resRoadmaps = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/game/${game.id}/roadmaps`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      },
    )
    const roadmaps = await resRoadmaps.json()
    state.roadmaps = roadmaps

    // Récupérer les auteurs des roadmaps
    await fetchRoadmapAuthors()
    // Si l'utilisateur est connecté, récupérer ses bookmarks
    if (userStore.profile) {
      await fetchUserBookmarks()
    }
  } catch (err) {
    state.error = 'Erreur lors du chargement des données.'
    console.error(err)
  } finally {
    state.loading = false
  }
}

const fetchRoadmapAuthors = async () => {
  try {
    // Récupérer les IDs des auteurs uniques
    const authorIds = [...new Set(state.roadmaps.map((rm) => rm.CreatedBy))]

    // Faire les appels API pour chaque auteur
    const authorPromises = authorIds.map(async (authorId) => {
      try {
        const userRes = await fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/user/${authorId}`,
        )
        if (userRes.ok) {
          const user = await userRes.json()
          state.authors.set(authorId, user)
        }
      } catch (err) {
        console.error(`Erreur lors du chargement de l'utilisateur ${authorId}:`, err)
        // En cas d'erreur, créer un utilisateur par défaut
        state.authors.set(authorId, {
          id: authorId,
          username: 'Unknown User',
          email: '',
          password: '',
          type: 'user',
          profilePicture: '',
          createdAt: '',
          updatedAt: '',
          lastLogin: '',
          Bookmarks: [],
          RoadmapsStarted: [],
          RoadmapsCreated: [],
          StepsCreated: [],
          ContentsCreated: [],
          Comments: [],
          GuidesCreated: [],
          AttachmentsCreated: []
        })
      }
    })

    // Attendre que tous les auteurs soient chargés
    await Promise.all(authorPromises)
  } catch (error) {
    console.error('Erreur lors du chargement des auteurs:', error)
  }
}

const fetchUserBookmarks = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/user/bookmarks`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      },
    )

    if (response.ok) {
      const bookmarks = await response.json()

      // Vérifier la structure des données et mapper correctement
      if (Array.isArray(bookmarks)) {
        // Si les bookmarks ont une propriété roadmapId
        if (bookmarks.length > 0 && bookmarks[0].id) {
          state.bookmarks = bookmarks.map((bookmark: Roadmap) => bookmark.id)
        }
        // Si les bookmarks sont directement des IDs de roadmap
        else if (bookmarks.length > 0 && typeof bookmarks[0] === 'string') {
          state.bookmarks = bookmarks
        }
        // Si les bookmarks ont une propriété id qui correspond à roadmapId
        else if (bookmarks.length > 0 && bookmarks[0].id) {
          state.bookmarks = bookmarks.map((bookmark: Roadmap) => bookmark.id)
        }
      }
    }
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
  }
}

// Fournir les bookmarks aux composants enfants
provide('bookmarks', state.bookmarks)
provide('updateBookmark', (roadmapId: string, isBookmarked: boolean) => {
  if (isBookmarked) {
    if (!state.bookmarks.includes(roadmapId)) {
      state.bookmarks.push(roadmapId)
    }
  } else {
    const index = state.bookmarks.indexOf(roadmapId)
    if (index > -1) {
      state.bookmarks.splice(index, 1)
    }
  }
})

onMounted(() => {
  fetchGameAndRoadmaps()
})

const searchText = reactive({ value: '' })

const filteredRoadmaps = computed(() => {
  if (!searchText.value.trim()) return state.roadmaps
  return state.roadmaps.filter((roadmap) =>
    roadmap.title.toLowerCase().includes(searchText.value.toLowerCase()),
  )
})

onUnmounted(() => {
  resetTitle()
})
</script>

<template>
  <main v-if="!state.loading && state.game">
    <HeaderGame
      :title="state.game.title"
      :description="state.game.description"
      :cover="state.game.cover"
      :roadmapsCount="state.roadmaps.length"
    />

    <div class="searchbar-container">
      <SearchBar placeholder="Search for a roadmap by name" v-model="searchText.value" />
    </div>

    <div class="roadmap-grid">
      <RoadmapCard
        v-for="r in filteredRoadmaps"
        :key="r.id"
        :id="r.id"
        :title="r.title"
        :subTitle="r.subTitle"
        :stepsCount="r.Steps?.length || 0"
        :isBookmarked="state.bookmarks.includes(r.id)"
        :author="state.authors.get(r.CreatedBy)"
      />
    </div>
  </main>

  <p v-if="state.loading" class="status">Chargement...</p>
  <p v-if="state.error" class="status error">{{ state.error }}</p>
</template>

<style scoped>
.status {
  text-align: center;
  margin-top: var(--spacing-lg);
  color: var(--color-light-gray);
}
.status.error {
  color: red;
}

.searchbar-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--spacing-xl) 0;
  margin: var(--spacing-xl) 0;
}

.roadmap-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xl);
  justify-content: center;
  padding: 0 var(--spacing-2xl) var(--spacing-2xl) var(--spacing-2xl);
}
.roadmap-card-placeholder {
  background: var(--color-charcoal);
  color: var(--color-white);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  min-width: 300px;
}
</style>
