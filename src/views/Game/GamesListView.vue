<!-- src/views/Game/GamesListView.vue -->

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import HeaderMenu from '@/components/layout/HeaderMenu.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import GameCard from '@/components/ui/GameCard.vue'

// Structure d’un jeu attendu depuis le back-end
type Game = {
  _id: string
  title: string
  subTitle: string
  cover: string
}

const state = reactive({
  games: [] as Game[],
  loading: true,
  error: '',
})

// Appel de l’API dès que le composant est monté
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/games')
    const data = await response.json()
    console.log(data)
    state.games = data
  } catch (error) {
    state.error = 'Erreur lors du chargement des jeux.'
    console.error(error)
  } finally {
    state.loading = false
  }
})
</script>

<template>
  <main>
    <HeaderMenu title="Choose your game" subTitle="Select a game to access dedicated roadmaps" />

    <div class="searchbar-container">
      <SearchBar placeholder="Search for a game by name" />
    </div>

    <div class="games-grid">
      <GameCard
        v-for="game in state.games"
        :key="game._id"
        :title="game.title"
        :subTitle="game.subTitle"
        :cover="game.cover"
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
  padding: var(--spacing-2xl) 0;
  margin: var(--spacing-2xl) 0;
}

.games-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xl);
  justify-content: center;
  padding-bottom: var(--spacing-2xl);
}

.status-text {
  text-align: center;
  color: var(--color-light-gray);
  margin-top: var(--spacing-lg);
}

.status-text.error {
  color: red;
}
</style>
