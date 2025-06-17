<!-- src/views/Game/GamesListView.vue -->

<script setup lang="ts">
import { onMounted, reactive, computed } from 'vue'
import HeaderMenu from '@/components/layout/HeaderMenu.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import GameCard from '@/components/ui/GameCard.vue'
import type { Game } from '@/types/collections'

const state = reactive({
  games: [] as Game[],
  loading: true,
  error: '',
})

onMounted(async () => {
  const apiUrl = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/games`

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    state.games = data
  } catch (error) {
    state.error = 'Erreur lors du chargement des jeux.'
    console.error(error)
  } finally {
    state.loading = false
  }
})

const searchText = reactive({ value: '' })

const filteredGames = computed(() => {
  if (!searchText.value.trim()) return state.games
  return state.games.filter((game) =>
    game.title.toLowerCase().includes(searchText.value.toLowerCase()),
  )
})
</script>

<template>
  <main>
    <HeaderMenu title="Choose your game" subTitle="Select a game to access dedicated roadmaps" />

    <div class="searchbar-container">
      <SearchBar placeholder="Search for a game by name" v-model="searchText.value" />
    </div>

    <div class="games-grid">
      <GameCard
        v-for="game in filteredGames"
        :key="game.id"
        :title="game.title"
        :subTitle="game.subTitle"
        :cover="game.cover"
        :id="game.id"
        :roadmaps-count="game.Roadmaps?.length || 0"
      />
    </div>

    <p v-if="state.loading" class="status-text">Chargement...</p>
    <p v-if="state.error" class="status-text error">{{ state.error }}</p>
  </main>
</template>

<style scoped>
.searchbar-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--spacing-xl) 0;
  margin: var(--spacing-xl) 0;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(400px, 400px));
  justify-content: center;
  gap: var(--spacing-3xl);
  padding-bottom: var(--spacing-2xl);
  margin: 0 auto;
}

.status-text {
  text-align: center;
  color: var(--color-light-gray);
  margin-top: var(--spacing-lg);
}

.status-text.error {
  color: red;
}

@media (max-width: 768px) {
  .games-grid {
    grid-template-columns: 1fr;
  }
}
</style>
