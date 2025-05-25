// src/components/ui/GamesSlider.vue

<template>
  <Carousel :itemsToShow="3" wrapAround :autoplayTimeout="3000">
    <Slide v-for="game in state.games" :key="game.id">
      <GameCardForSlider :game="game" />
    </Slide>
  </Carousel>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import GameCardForSlider from './GameCardForSlider.vue'
import type { Game } from '@/types/collections'

const state = reactive({
  games: [] as Game[],
  loading: true,
  error: '',
})

onMounted(async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/games`,
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    state.games = await res.json()
  } catch (err) {
    state.error = 'Erreur lors du chargement des jeux'
    console.error('Error loading games:', err)
  } finally {
    state.loading = false
  }
})
</script>

<style scoped>
.carousel {
  width: 100%;
  margin: 0 auto;
}
</style>
