<!-- src/views/Roadmap/RoadmapView.vue -->

<script setup lang="ts">
import FlowchartGraph from '@/components/ui/FlowchartGraph.vue'
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import HeaderRoadmap from '@/components/layout/HeaderRoadmap.vue'
import type { Content, Roadmap, Step } from '@/types/collections'

const state = reactive({
  roadmap: null as Roadmap | null,
  steps: [] as Step[],
  contents: [] as Content[],
  loading: true,
  error: '',
})

const route = useRoute()
const roadmapId = route.params.id as string

onMounted(async () => {
  try {
    // Récupération des détails de la roadmap
    const resRoadmap = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${roadmapId}`,
    )
    const roadmap = await resRoadmap.json()
    state.roadmap = roadmap

    // Récupération des étapes associées à la roadmap
    const resSteps = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${roadmapId}/steps`,
    )
    const steps = await resSteps.json()
    state.steps = steps
  } catch (error) {
    state.error = 'Erreur lors du chargement de la roadmap.'
    console.error('[ERREUR]', error)
  } finally {
    state.loading = false
  }
})
</script>

<template>
  <main>
    <HeaderRoadmap
      v-if="state.roadmap"
      :title="state.roadmap.title"
      :description="state.roadmap.description"
      :cover="state.roadmap.cover"
      :stepsCount="state.steps.length"
    />

    <p v-if="state.loading" class="status">Loading...</p>
    <p v-if="state.error" class="status error">{{ state.error }}</p>

    <FlowchartGraph v-if="state.steps.length" :steps="state.steps" />
  </main>
</template>

<style scoped></style>
