<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- src/views/Roadmap/RoadmapView.vue -->

<script setup lang="ts">
import StepDrawer from '@/components/ui/StepDrawer.vue'
import { onMounted, reactive, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import HeaderRoadmap from '@/components/layout/HeaderRoadmap.vue'
import { MarkerType, VueFlow, useVueFlow } from '@vue-flow/core'
import { Background, Controls, MiniMap } from '@vue-flow/additional-components'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import type { Content, Roadmap, Step } from '@/types/collections'

const state = reactive({
  roadmap: null as Roadmap | null,
  steps: [] as Step[],
  loading: true,
  error: '',
})

// ID de l'étape sélectionnée et contenus à afficher
const selectedStepId = ref<string | null>(null)
const stepContents = ref<Content[]>([])
const drawerOpen = ref(false)

const route = useRoute()
const roadmapId = route.params.id as string

// États VueFlow
const nodes = ref<any[]>([])
const edges = ref<any[]>([])

// Extraire fitView
const { fitView } = useVueFlow()

// Construire l'arbre hiérarchique
function buildFlowFromSteps() {
  if (!state.steps.length) {
    nodes.value = []
    edges.value = []
    return
  }

  // Créer une map des nœuds
  const nodeMap = new Map<string, any>()

  state.steps.forEach((step) => {
    nodeMap.set(step.id, {
      id: step.id,
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        title: step.title,
        subTitle: step.subTitle,
        contents: step.Contents?.length || 0,
        hasPrevious: step.PreviousSteps && step.PreviousSteps.length > 0,
      },
      draggable: false,
      selectable: true,
      style: { width: 250, height: 120 },
    })
  })

  // Générer les edges basés sur PreviousSteps et NextSteps
  const edgeList: any[] = []

  state.steps.forEach((step) => {
    // Créer des edges depuis les étapes précédentes vers cette étape
    if (step.PreviousSteps && step.PreviousSteps.length > 0) {
      step.PreviousSteps.forEach((previousStepId) => {
        edgeList.push({
          id: `${previousStepId}-${step.id}`,
          source: previousStepId,
          target: step.id,
          type: 'smoothstep',
          animated: true,
          style: {
            stroke: '#ffd700',
            strokeWidth: 3,
            strokeDasharray: '10 5',
            filter: 'drop-shadow(0 2px 8px rgba(255, 215, 0, 0.4))',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#ffd700',
            width: 20,
            height: 20,
          },
          deletable: false,
        })
      })
    }

    // Alternative : créer des edges vers les étapes suivantes
    if (step.NextSteps && step.NextSteps.length > 0) {
      step.NextSteps.forEach((nextStepId) => {
        // Vérifier qu'on n'a pas déjà créé cet edge
        const edgeExists = edgeList.some(
          (edge) => edge.source === step.id && edge.target === nextStepId,
        )

        if (!edgeExists) {
          edgeList.push({
            id: `${step.id}-${nextStepId}`,
            source: step.id,
            target: nextStepId,
            type: 'smoothstep',
            animated: true,
            style: {
              stroke: '#ffd700',
              strokeWidth: 3,
              strokeDasharray: '10 5',
              filter: 'drop-shadow(0 2px 8px rgba(255, 215, 0, 0.4))',
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#ffd700',
              width: 20,
              height: 20,
            },
            deletable: false,
          })
        }
      })
    }
  })

  nodes.value = Array.from(nodeMap.values())
  edges.value = edgeList

  // Auto-layout hiérarchique
  layoutNodes()
}

// Fonction de layout automatique
function layoutNodes() {
  const H_GAP = 350
  const V_GAP = 180
  const levels = new Map<number, any[]>()
  const visited = new Set<string>()

  // BFS pour organiser les nœuds par niveaux
  const queue: { nodeId: string; level: number }[] = []

  // Trouver les nœuds racines (sans prédécesseurs)
  const roots = nodes.value.filter((node) => !node.data.hasPrevious)

  if (roots.length === 0 && nodes.value.length > 0) {
    // Si aucune racine n'est trouvée, prendre le premier nœud
    queue.push({ nodeId: nodes.value[0].id, level: 0 })
  } else {
    roots.forEach((node) => queue.push({ nodeId: node.id, level: 0 }))
  }

  // Traitement BFS
  while (queue.length > 0) {
    const { nodeId, level } = queue.shift()!

    if (visited.has(nodeId)) continue
    visited.add(nodeId)

    // Ajouter le nœud au niveau approprié
    if (!levels.has(level)) {
      levels.set(level, [])
    }
    const node = nodes.value.find((n) => n.id === nodeId)
    if (node) {
      levels.get(level)!.push(node)
    }

    // Trouver les enfants (nœuds connectés par des edges sortants)
    edges.value
      .filter((edge) => edge.source === nodeId)
      .forEach((edge) => {
        if (!visited.has(edge.target)) {
          queue.push({ nodeId: edge.target, level: level + 1 })
        }
      })
  }

  // Positionner les nœuds
  levels.forEach((nodesAtLevel, level) => {
    const totalWidth = (nodesAtLevel.length - 1) * H_GAP
    const startX = -totalWidth / 2

    nodesAtLevel.forEach((node, index) => {
      node.position = {
        x: startX + index * H_GAP,
        y: level * V_GAP,
      }
    })
  })

  // Ajuster pour éviter les positions négatives
  const minX = Math.min(...nodes.value.map((n) => n.position.x))
  const minY = Math.min(...nodes.value.map((n) => n.position.y))

  if (minX < 0 || minY < 0) {
    nodes.value.forEach((node) => {
      node.position.x = Math.max(50, node.position.x - minX + 50)
      node.position.y = Math.max(50, node.position.y - minY + 50)
    })
  }

  // Centrer la vue après un court délai
  setTimeout(() => {
    fitView({ padding: 0.15 })
  }, 150)
}

// Reconstruire le flow quand les steps changent
watch(() => state.steps, buildFlowFromSteps, { immediate: true })

// Récupération initiale
onMounted(async () => {
  try {
    const resR = await fetch(`${import.meta.env.VITE_API_URL}/roadmap/${roadmapId}`)
    state.roadmap = await resR.json()

    const resS = await fetch(`${import.meta.env.VITE_API_URL}/roadmap/${roadmapId}/steps`)
    state.steps = await resS.json()
  } catch (err) {
    state.error = 'Erreur lors du chargement de la roadmap.'
    console.error(err)
  } finally {
    state.loading = false
  }
})

/** Computed pour récupérer l'objet Step sélectionné */
const selectedStep = computed(() => state.steps.find((s) => s.id === selectedStepId.value) || null)

// Ouverture de la drawer et fetch des contenus
async function openStep(stepId: string) {
  selectedStepId.value = stepId
  drawerOpen.value = true

  // Initialiser avec un tableau vide pour éviter les erreurs null
  stepContents.value = []

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/step/${stepId}/contents`)

    if (!res.ok) {
      console.error('Fetch failed', res.status)
      // Garder le tableau vide plutôt que de le définir à null
      stepContents.value = []
      return
    }

    const data = await res.json()

    // Vérifier que la réponse est bien un tableau
    if (Array.isArray(data)) {
      stepContents.value = data
    } else {
      console.warn('API response is not an array:', data)
      stepContents.value = []
    }
  } catch (error) {
    console.error('Error fetching step contents:', error)
    // En cas d'erreur, toujours utiliser un tableau vide
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

    <!-- VueFlow avec gestion des clics -->
    <div class="flow-wrapper">
      <div class="flow-container">
        <VueFlow
          v-if="nodes.length && !state.loading"
          v-model:nodes="nodes"
          v-model:edges="edges"
          :fit-view-on-init="true"
          :nodes-draggable="false"
          :nodes-connectable="false"
          :elements-selectable="true"
          class="roadmap-vueflow"
        >
          <!-- Template pour les nœuds personnalisés -->
          <template #node-custom="{ data, id }">
            <div class="rf-node" :class="{ 'root-node': !data.hasPrevious }" @click="openStep(id)">
              <div class="node-header">
                <i class="pi pi-flag" v-if="!data.hasPrevious"></i>
                <h4>{{ data.title }}</h4>
              </div>
              <small v-if="data.subTitle">{{ data.subTitle }}</small>
              <div class="contents-badge">
                <i class="pi pi-link"></i> {{ data.contents }} content{{
                  data.contents > 1 ? 's' : ''
                }}
              </div>
            </div>
          </template>

          <Background color="#2a2a2a" :gap="20" />
          <Controls :show-zoom="true" :show-fit-view="true" :show-interactive="true" />

          <MiniMap :pannable="true" :zoomable="true" />
        </VueFlow>

        <!-- Message si aucune étape -->
        <div v-else-if="!state.loading && !state.steps.length" class="no-steps">
          <p>No steps avaible for this roadmap.</p>
        </div>
      </div>
    </div>

    <!-- Drawer pour afficher les détails de l'étape -->
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

.no-steps {
  text-align: center;
  margin: var(--spacing-xl) 0;
  color: var(--color-light-gray);
}

.roadmap-vueflow {
  width: 100%;
  height: 700px;
  background: var(--color-darker-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.flow-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: var(--spacing-3xl) 0;
  padding: 0 var(--spacing-lg);
}

.flow-container {
  width: 100%;
  max-width: 1000px;
  background: var(--color-darker-charcoal);
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
}

.flow-container.dragging {
  cursor: grabbing;
  border-color: var(--color-gold);
  background: rgba(255, 215, 0, 0.05);
}

.rf-node {
  background: var(--color-dark-gray);
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  text-align: center;
  color: var(--color-cream);
  font-family: var(--font-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.rf-node:hover {
  border-color: var(--color-gold);
  background: var(--color-charcoal);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
}

.rf-node.root-node {
  border-color: var(--color-gold);
  background: var(--color-charcoal);
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
}

.rf-node .node-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.rf-node .node-header i {
  color: var(--color-gold);
  font-size: var(--font-size-base);
}

.rf-node h4 {
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--color-gold);
  font-weight: 600;
  text-align: center;
}

.rf-node small {
  display: block;
  color: var(--color-light-gray);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
  line-height: 1.3;
}

.contents-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
  color: var(--color-charcoal);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.1px;
}

.contents-badge.full-width {
  width: 100%;
}
.contents-badge.btn-primary {
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
  color: var(--color-charcoal);
}
.contents-badge.btn-secondary {
  background: var(--color-charcoal);
  color: var(--color-cream);
  border: 1px solid var(--color-gold);
}
.contents-badge:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
.contents-badge:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-light-yellow), var(--color-gold));
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}

@media (max-width: 1024px) {
  .flow-wrapper {
    padding: 0 var(--spacing-xl);
    margin: var(--spacing-2xl) 0;
  }

  .flow-container {
    max-width: 100%;
  }

  .roadmap-vueflow {
    height: 600px; /* Réduire la hauteur sur tablette */
  }
}

@media (max-width: 768px) {
  .flow-wrapper {
    padding: 0 var(--spacing-xl);
    margin: var(--spacing-xl) 0;
  }

  .roadmap-vueflow {
    height: 500px; /* Hauteur adaptée mobile */
    border-radius: var(--radius-sm);
  }

  .flow-container {
    border-radius: var(--radius-sm);
  }

  /* Adapter la taille des noeuds pour mobile */
  .rf-node {
    padding: var(--spacing-sm);
  }

  .rf-node h4 {
    font-size: var(--font-size-sm);
  }

  .contents-badge {
    font-size: var(--font-size-xs);
    padding: 0.2rem 0.4rem;
  }
}

@media (max-width: 576px) {
  .flow-wrapper {
    padding: 0 var(--spacing-xl);
  }

  .roadmap-vueflow {
    height: 400px; /* Hauteur réduite pour petits écrans */
  }

  /* Réduire encore la taille des éléments */
  .rf-node {
    padding: var(--spacing-xs);
  }

  .rf-node .node-header {
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-xs);
  }

  .rf-node small {
    font-size: var(--font-size-xs);
    margin-bottom: var(--spacing-xs);
  }
}
</style>
