// src/components/ui/RoadmapsSlider.vue

<template>
  <Carousel :itemsToShow="3" wrapAround :autoplayTimeout="3000">
    <Slide v-for="rm in state.roadmaps" :key="rm.id">
      <RoadmapCardForSlider :roadmap="rm" />
    </Slide>
  </Carousel>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import RoadmapCardForSlider from './RoadmapCardForSlider.vue'
import type { Roadmap } from '@/types/collections'

const state = reactive({
  roadmaps: [] as Roadmap[],
  loading: true,
  error: '',
})

onMounted(async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmaps`,
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    state.roadmaps = await res.json()
  } catch (err) {
    state.error = 'Erreur lors du chargement des roadmaps'
    console.error('Error loading roadmaps:', err)
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
