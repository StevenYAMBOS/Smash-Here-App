<!-- src/views/Roadmap/RoadmapView.vue -->

<script setup lang="ts">
import FlowchartGraph from '@/components/ui/FlowchartGraph.vue'
import StepDrawer from '@/components/ui/StepDrawer.vue'
import { onMounted, reactive, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderRoadmap from '@/components/layout/HeaderRoadmap.vue'
import type { Content, Roadmap, Step } from '@/types/collections'

const state = reactive({
  roadmap: null as Roadmap | null,
  steps: [] as Step[],
  loading: true,
  error: '',
})

// ID de l’étape sélectionnée et contenus à afficher
const selectedStepId = ref<string | null>(null)
const stepContents = ref<Content[]>([])
const drawerOpen = ref(false)

const route = useRoute()
const roadmapId = route.params.id as string

// Récupération initiale
onMounted(async () => {
  try {
    const resR = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${roadmapId}`,
    )
    state.roadmap = await resR.json()

    const resS = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${roadmapId}/steps`,
    )
    state.steps = await resS.json()
  } catch (err) {
    state.error = 'Erreur lors du chargement de la roadmap.'
    console.error(err)
  } finally {
    state.loading = false
  }
})

/** Computed pour récupérer l’objet Step sélectionné */
const selectedStep = computed(() => state.steps.find((s) => s.id === selectedStepId.value) || null)

// Ouverture de la drawer et fetch des contenus
async function openStep(stepId: string) {
  selectedStepId.value = stepId
  drawerOpen.value = true

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/step/${stepId}/contents`,
  )
  if (!res.ok) {
    console.error('Fetch failed', res.status)
    stepContents.value = []
    return
  }

  try {
    stepContents.value = await res.json()
  } catch {
    console.error('JSON parse error')
    stepContents.value = []
  }
}
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

    <FlowchartGraph v-if="state.steps.length" :steps="state.steps" @select="openStep" />

    <StepDrawer
      :visible="drawerOpen"
      :step="selectedStep"
      :contents="stepContents"
      @close="drawerOpen = false"
    />
  </main>
</template>

<style scoped>
.status {
  text-align: center;
  margin: var(--spacing-lg) 0;
  color: var(--color-light-gray);
}
.status.error {
  color: var(--color-gold);
}

/* drawer backdrop */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
</style>
