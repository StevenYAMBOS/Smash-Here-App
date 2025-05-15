<!-- src/views/Roadmap/RoadmapView.vue -->

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import HeaderRoadmap from '@/components/layout/HeaderRoadmap.vue'
import type { Roadmap, Step } from '@/types/collections'
import { VueFlow, useVueFlow, type Node, type Edge, Position, BezierEdge } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/controls/dist/style.css'

const { onNodeClick } = useVueFlow()

const elements = reactive<Node[]>([])
const edges = reactive<Edge[]>([])

const route = useRoute()
const roadmapId = route.params.id as string
const state = reactive({
  roadmap: null as Roadmap | null,
  steps: [] as Step[],
  loading: true,
  error: '',
})

const fetchSteps = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${roadmapId}/steps`,
    )
    const data: Step[] = await res.json()
    state.steps = data

    elements.splice(0)
    edges.splice(0)

    const idToNode = new Map<string, Node>()

    state.steps.forEach((step, index) => {
      const node: Node = {
        id: step.id,
        type: 'default',
        position: { x: 0, y: index * 180 },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        data: { label: step.title },
        style: {
          backgroundColor: '#252525',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #444',
          width: '200px',
          zIndex: 10,
        },
      }

      idToNode.set(step.id, node)
      elements.push(node)

      step.PreviousSteps?.forEach((prevId) => {
        edges.push({
          id: `${prevId}->${step.id}`,
          source: prevId,
          target: step.id,
          animated: true,
          style: { stroke: '#ffa600' },
        })
      })
    })
  } catch (e) {
    console.error(e)
    state.error = 'Erreur lors du chargement des étapes.'
  }
}

onMounted(async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${roadmapId}`,
    )
    const data = await res.json()
    state.roadmap = data
    await fetchSteps()
  } catch (error) {
    state.error = 'Erreur lors du chargement de la roadmap.'
    console.error(error)
  } finally {
    state.loading = false
  }
})

// Gestion des clics sur les étapes
onNodeClick(({ node }) => {
  console.log('Étape cliquée :', node.id)
  // TODO : afficher un menu déroulant ici
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

    <p v-if="state.loading" class="status">Chargement...</p>
    <p v-if="state.error" class="status error">{{ state.error }}</p>

    <div class="node-container">
      <VueFlow
        v-if="elements.length > 0"
        :nodes="elements"
        :edges="edges"
        class="vueflow-theme"
        :nodes-draggable="false"
        :connection-line-options="BezierEdge"
        :fit-view="true"
        :min-zoom="0.3"
        :max-zoom="1.5"
        :pan-on-scroll="false"
      >
        <Controls />
      </VueFlow>
    </div>
  </main>
</template>

<style scoped>
@import '@vue-flow/core/dist/theme-default.css';
.node-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.status {
  text-align: center;
  margin-top: var(--spacing-lg);
  color: var(--color-light-gray);
}
.status.error {
  color: red;
}
</style>
