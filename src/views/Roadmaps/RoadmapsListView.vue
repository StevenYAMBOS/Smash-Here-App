<!--
src/views/Roadmaps/RoadmapsListView.vue

Composant qui affiche la liste des roadmaps d'un jeu
-->

<script setup lang="ts">
import { onMounted, reactive, computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import HeaderGame from '@/components/layout/HeaderGame.vue'
import RoadmapCard from '@/components/ui/RoadmapCard.vue'
import type { Game, Roadmap } from '@/types/collections'
import SearchBar from '@/components/ui/SearchBar.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const slug = route.params.slug as string
const userStore = useUserStore()

const state = reactive({
  game: null as Game | null,
  roadmaps: [] as Roadmap[],
  bookmarks: [] as Roadmap[],
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
      state.error = 'Jeu introuvable.'
      return
    }

    state.game = game

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
        if (bookmarks.length > 0 && bookmarks[0].roadmapId) {
          state.bookmarks = bookmarks.map((bookmark: Roadmap) => bookmark.roadmapId)
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
  padding: var(--spacing-2xl) 0;
  margin: var(--spacing-2xl) 0;
}

.roadmap-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xl);
  justify-content: center;
  padding: var(--spacing-2xl);
}
.roadmap-card-placeholder {
  background: var(--color-charcoal);
  color: var(--color-white);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  min-width: 300px;
}
</style>
