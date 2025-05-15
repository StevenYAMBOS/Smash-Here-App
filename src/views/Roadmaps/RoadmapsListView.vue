<!-- src/views/Roadmaps/RoadmapsListView.vue -->

<script setup lang="ts">
import { onMounted, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderGame from '@/components/layout/HeaderGame.vue'
import RoadmapCard from '@/components/ui/RoadmapCard.vue'
import type { Game, Roadmap } from '@/types/collections'
import SearchBar from '@/components/ui/SearchBar.vue'

const route = useRoute()
const slug = route.params.slug as string

const state = reactive({
  game: null as Game | null,
  roadmaps: [] as Roadmap[],
  loading: true,
  error: '',
})

const fetchGameAndRoadmaps = async () => {
  try {
    // Appel à l’API pour tous les jeux
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
  } catch (err) {
    state.error = 'Erreur lors du chargement des données.'
    console.error(err)
  } finally {
    state.loading = false
  }
}

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
