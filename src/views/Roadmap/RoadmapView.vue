<!-- src/views/Roadmap/RoadmapView.vue -->

<script setup lang="ts">
import StepDrawer from '@/components/ui/StepDrawer.vue'
import { onMounted, reactive, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderRoadmap from '@/components/layout/HeaderRoadmap.vue'
import { VueFlow } from '@vue-flow/core'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import { Background } from '@vue-flow/background'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
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

// dimensions pour VueFlow
const NODE_WIDTH = 200
const NODE_HEIGHT = 100

// transforme state.steps en nodes & edges
const nodes = computed(() =>
  state.steps.map(
    (s: { id: any; title: any; subTitle: any; Contents: string | any[] }, i: number) => ({
      id: s.id,
      position: { x: i * (NODE_WIDTH + 50), y: 0 }, // simple layout horizontal
      data: { label: s.title, subLabel: s.subTitle, contents: s.Contents?.length || 0 },
      style: { width: NODE_WIDTH, height: NODE_HEIGHT },
      draggable: false, // read-only
    }),
  ),
)
const edges = computed(() =>
  state.steps.flatMap((s: { PreviousSteps: any; id: any }) =>
    (s.PreviousSteps ?? []).map((p: any) => ({
      id: `${p}-${s.id}`,
      source: p,
      target: s.id,
      animated: false,
      style: { stroke: '#888', strokeWidth: 1 },
    })),
  ),
)

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
const selectedStep = computed(
  () => state.steps.find((s: { id: string | null }) => s.id === selectedStepId.value) || null,
)

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

    <!-- VueFlow read-only -->
    <VueFlow
      v-if="nodes.length"
      :nodes="nodes"
      :edges="edges"
      :fit-view-on-init="true"
      :nodes-draggable="false"
      :nodes-connectable="false"
      :elements-selectable="false"
      class="roadmap-vueflow"
      @node-click="(_: any, node: { id: string }) => openStep(node.id)"
    >
      <Background color="#444" gap="16" size="1" />
      <Controls />
      <MiniMap />
    </VueFlow>

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

.roadmap-vueflow {
  width: 100%;
  height: 600px;
  background: var(--color-darker-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
}

/* drawer backdrop */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
</style>
