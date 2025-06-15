<!-- src/components/ui/UpdateRoadmapForm.vue -->
<template>
  <div class="update-roadmap-container">
    <!-- Onglets -->
    <div class="tabs">
      <button
        :class="{ active: currentTab === 'info' }"
        @click="currentTab = 'info'"
        class="tab-button"
      >
        Informations
      </button>
      <button
        :class="{ active: currentTab === 'structure' }"
        @click="currentTab = 'structure'"
        class="tab-button"
      >
        Steps
      </button>
    </div>

    <!-- **************** Onglet “Informations de base” **************** -->
    <div v-if="currentTab === 'info'" class="tab-content">
      <form @submit.prevent="submitInfo" class="update-roadmap-form">
        <h2>Informations</h2>

        <div class="form-section">
          <div class="field">
            <label for="title">Title</label>
            <input id="title" v-model="title" type="text" required />
          </div>

          <div class="field">
            <label for="subTitle">Subtitle</label>
            <input id="subTitle" v-model="subTitle" type="text" />
          </div>

          <div class="field">
            <label for="description">Description</label>
            <textarea id="description" v-model="description" rows="3" required></textarea>
          </div>

          <div class="field-row">
            <div class="switch-field">
              <label for="published-switch">Published</label>
              <button
                id="published-switch"
                type="button"
                class="switch-button"
                :class="{ active: published }"
                @click="published = !published"
                role="switch"
                :aria-checked="published"
              >
                <span class="switch-handle"></span>
              </button>
            </div>

            <!-- <div class="switch-field">
              <label for="premium-switch">Premium</label>
              <button
                id="premium-switch"
                type="button"
                class="switch-button"
                :class="{ active: premium }"
                @click="premium = !premium"
                role="switch"
                :aria-checked="premium"
              >
                <span class="switch-handle"></span>
              </button>
            </div> -->
          </div>

          <div class="field">
            <label>Roadmap's games</label>
            <MultiSelect
              id="games_label"
              v-model="selectedGameIds"
              :options="availableGames"
              optionLabel="title"
              optionValue="id"
              display="chip"
              placeholder="Select games"
              :showClear="true"
              class="p-multiselect-field"
            >
              <template #option="slotProps">
                <div class="game-option">
                  <i class="pi pi-gamepad2"></i>
                  <span>{{ slotProps.option.title }}</span>
                </div>
              </template>
            </MultiSelect>
          </div>

          <div class="field">
            <label for="cover">Cover image</label>

            <!-- Zone de prévisualisation (cliquable) -->
            <div class="cover-preview-wrapper" @click="triggerFileInput">
              <img
                v-if="coverPreview"
                :src="coverPreview"
                alt="Cover Preview"
                class="cover-preview-img"
              />
              <div v-else class="cover-placeholder">
                <i class="pi pi-image"></i>
                <span>Nouvelle couverture...</span>
              </div>
            </div>

            <!-- Input file (caché) -->
            <input
              id="cover"
              type="file"
              accept="image/webp,image/png,image/jpeg"
              @change="handleFileChange"
              class="file-input"
            />

            <p class="file-hint">Accepted format : WEBP, PNG, JPEG (max 10 MB)</p>
          </div>
        </div>

        <div class="actions-row">
          <SubmitButton
            label="Cancel"
            icon="pi pi-times"
            variant="secondary"
            type="button"
            @click="emit('navigate', 'list-roadmaps')"
          />
          <SubmitButton
            id="btn-save-info"
            :label="infoLoading ? 'Saving...' : 'Save'"
            :disabled="infoLoading"
            icon="pi pi-save"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
    </div>

    <!-- **************** Onglet "Étapes” **************** -->
    <div v-if="currentTab === 'structure'" class="tab-content">
      <h2>Steps</h2>

      <!-- Message pour mobile/tablette -->
      <div class="mobile-steps-message">
        <div class="mobile-message-card">
          <i class="pi pi-desktop"></i>
          <h3>Desktop Required</h3>
          <p>
            The roadmap structure editor is only available on desktop devices for optimal user
            experience. Please use a computer to organize and connect your steps.
          </p>
          <div class="mobile-message-actions">
            <button @click="currentTab = 'info'" class="mobile-back-button">
              <i class="pi pi-arrow-left"></i>
              Back to Informations
            </button>
          </div>
        </div>
      </div>

      <!-- Contenu desktop (masqué sur mobile/tablette) -->
      <div class="desktop-steps-content">
        <div class="flow-info-card">
          <div class="flow-info-header">
            <i class="pi pi-info-circle"></i>
            <h4>How to organize your roadmap</h4>
          </div>
          <div class="flow-info-content">
            <div class="flow-info-item">
              <i class="pi pi-arrows-alt"></i>
              <span><strong>Move nodes:</strong> Drag to reposition steps</span>
            </div>
            <div class="flow-info-item">
              <i class="pi pi-link"></i>
              <span><strong>Connect steps:</strong> Drag from bottom handle to top handle</span>
            </div>
            <div class="flow-info-item">
              <i class="pi pi-times-circle"></i>
              <span
                ><strong>Remove:</strong> Click the × button on nodes or select edges and press
                Delete</span
              >
            </div>
          </div>
        </div>

        <div class="structure-actions">
          <div class="field">
            <label>Available Steps</label>
            <MultiSelect
              v-model="selectedStepIds"
              :options="availableSteps"
              optionLabel="title"
              optionValue="id"
              display="chip"
              placeholder="Select steps to include"
              :showClear="true"
              @change="onStepSelectionChange"
              class="p-multiselect-field"
            >
              <template #option="slotProps">
                <div
                  class="step-multiselect-option"
                  draggable="true"
                  @dragstart="onDragStart($event, slotProps.option)"
                >
                  <i class="pi pi-diagram"></i>
                  <span>{{ slotProps.option.title }}</span>
                </div>
              </template>
            </MultiSelect>
          </div>

          <div class="structure-save">
            <SubmitButton
              :label="structureLoading ? 'Saving...' : 'Save'"
              :disabled="structureLoading"
              icon="pi pi-save"
              variant="primary"
              type="button"
              @click="submitStructure"
            />
          </div>
        </div>

        <div
          v-if="selectedSteps.length > 0"
          class="flow-container"
          :class="{ dragging: isDragging }"
          @dragover.prevent
          @drop="onDrop"
        >
          <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            @connect="onConnect"
            @edges-change="onEdgesChange"
            @nodes-change="onNodesChange"
            :fit-view-on-init="true"
            :connection-line-style="connectionLineStyle"
            :default-edge-options="defaultEdgeOptions"
            :delete-key-code="['Delete', 'Backspace']"
            :edges-updatable="true"
            :edges-focusable="true"
            class="roadmap-flow"
          >
            <template #node-custom="{ id, data }">
              <div class="custom-node" :class="{ 'root-node': !data.hasPrevious }">
                <Handle type="target" :position="Position.Top" :style="handleStyle" />

                <div class="node-content">
                  <div class="node-header">
                    <i class="pi pi-flag" v-if="!data.hasPrevious"></i>
                    <span>{{ data.label }}</span>
                  </div>
                  <div class="node-actions">
                    <button
                      type="button"
                      @click.stop="removeStepNode(id)"
                      class="btn-remove"
                      title="Retirer cette étape"
                    >
                      <i class="pi pi-times"></i>
                    </button>
                  </div>
                </div>

                <Handle type="source" :position="Position.Bottom" :style="handleStyle" />
              </div>
            </template>

            <Background :color="'#2a2a2a'" :gap="20" />
            <Controls :show-zoom="true" :show-fit-view="true" :show-interactive="true" />
            <MiniMap :pannable="true" :zoomable="true" />
          </VueFlow>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { VueFlow, useVueFlow, Position, Handle, MarkerType } from '@vue-flow/core'
import { Background, Controls, MiniMap } from '@vue-flow/additional-components'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
// import Multiselect from '@vueform/multiselect'
import MultiSelect from 'primevue/multiselect'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'
import SubmitButton from './SubmitButton.vue'
import type { Roadmap, Step } from '@/types/collections'

const toast = useToast()
const userStore = useUserStore()
const { fitView, addEdges, applyNodeChanges, applyEdgeChanges } = useVueFlow()

// Props & Événements
const props = defineProps<{
  roadmap: Roadmap
}>()
const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

// Onglets
const currentTab = ref<'info' | 'structure'>('info')

/* +++++++++++++++++++++++++++++ INFOS DE BASE +++++++++++++++++++++++++++++ */

const infoLoading = ref(false)
const title = ref(props.roadmap.title)
const subTitle = ref(props.roadmap.subTitle || '')
const description = ref(props.roadmap.description)
const coverFile = ref<File | null>(null)
const published = ref(props.roadmap.published || false)
// const premium = ref(props.roadmap.premium || false)
const selectedGameIds = ref<string[]>([])
const availableGames = computed(() => userStore.games || [])

// Récupération de données
onMounted(async () => {
  coverPreview.value = props.roadmap.cover || null

  if (!userStore.games?.length) {
    await userStore.fetchAllGames()
  }
  if (props.roadmap.Games?.length) {
    selectedGameIds.value = props.roadmap.Games
  }
})
const selectedStepIds = ref<string[]>([])

// Synchroniser selectedStepIds avec selectedSteps
watch(selectedStepIds, (newIds) => {
  selectedSteps.value = availableSteps.value.filter((step) => newIds.includes(step.id))
})

// Fonction appelée quand la sélection change
function onStepSelectionChange() {
  // La synchronisation se fait via le watch
}

// URL de prévisualisation de la couverture
const coverPreview = ref<string | null>(null)

// Gestion de l'image
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Validation taille et type
  if (file.size > 10 * 1024 * 1024) {
    toast.error('The size must be < 10 MB.')
    return
  }
  const validTypes = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg']
  if (!validTypes.includes(file.type)) {
    toast.error('Invalide format (WEBP, PNG, JPEG).')
    return
  }

  // Enregistrer le fichier sélectionné
  coverFile.value = file

  // Générer une URL locale pour affichage de prévisualisation
  coverPreview.value = URL.createObjectURL(file)
}

// Changement de l'image
function triggerFileInput() {
  const fileInput = document.getElementById('cover') as HTMLInputElement
  fileInput?.click()
}

// Validation formulaire (informations de bases)
async function submitInfo() {
  if (infoLoading.value) return
  infoLoading.value = true

  try {
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('subTitle', subTitle.value)
    formData.append('description', description.value)
    formData.append('published', published.value.toString())
    // formData.append('premium', premium.value.toString())
    // Ne pas inclure Games dans FormData car le backend les gère séparément

    if (coverFile.value) {
      formData.append('cover', coverFile.value)
    }

    const infoResponse = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${props.roadmap.id}/info`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
        body: formData,
      },
    )

    if (!infoResponse.ok) {
      throw new Error(`HTTP error! status: ${infoResponse.status}`)
    }

    // Mettre à jour les jeux avec un call API séparé
    const gamesResponse = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${props.roadmap.id}/games`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.token}`,
        },
        body: JSON.stringify({
          Games: selectedGameIds.value,
        }),
      },
    )

    if (!gamesResponse.ok) {
      throw new Error(`Failed to update games association`)
    }

    toast.success('Roadmap updated successfully!')
    await userStore.fetchUserRoadmaps()
    emit('navigate', 'list-roadmaps')
  } catch (err) {
    console.error(err)
    toast.error(err instanceof Error ? err.message : 'Error during update')
  } finally {
    infoLoading.value = false
  }
}

/* +++++++++++++++++++++++++++++ STRUCTURE DES ÉTAPES +++++++++++++++++++++++++++++ */

const structureLoading = ref(false)
const availableSteps = computed(() => userStore.stepsCreated || [])
const selectedSteps = ref<Step[]>([])

// VueFlow state
const isDragging = ref(false)
const draggedStep = ref<Step | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodes = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const edges = ref<any[]>([])

// Styles VueFlow
const handleStyle = {
  background: 'var(--color-gold)',
  width: '12px',
  height: '12px',
  border: '2px solid var(--color-charcoal)',
}
const connectionLineStyle = {
  stroke: 'var(--color-gold)',
  strokeWidth: 2,
}
const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: {
    stroke: 'var(--color-gold)',
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'var(--color-gold)',
  },
}

// Charger les étapes initiales et construire le graphe
onMounted(async () => {
  // S’assurer que l’utilisateur a bien chargé ses steps et games
  if (!userStore.stepsCreated?.length) {
    await userStore.fetchUserSteps()
  }
  if (!userStore.games?.length) {
    await userStore.fetchAllGames()
  }

  // Initialiser selectedSteps à partir de roadmap.Steps (tableau d’IDs)
  if (props.roadmap.Steps?.length) {
    selectedStepIds.value = props.roadmap.Steps
    selectedSteps.value = availableSteps.value.filter((s) => props.roadmap.Steps.includes(s.id))
    buildFlowFromSteps()
  }
})

// Watch : si on vide completely, reset nodes/edges
watch(selectedSteps, (newSteps) => {
  if (newSteps.length > 0) {
    buildFlowFromSteps()
  } else {
    nodes.value = []
    edges.value = []
  }
})

// Construire nodes & edges à partir de selectedSteps
function buildFlowFromSteps() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeMap = new Map<string, any>()
  selectedSteps.value.forEach((step) => {
    const node = {
      id: step.id,
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        id: step.id,
        label: step.title,
        hasPrevious: !!step.PreviousSteps?.length,
      },
    }
    nodeMap.set(step.id, node)
  })
  nodes.value = Array.from(nodeMap.values())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const edgeList: any[] = []
  selectedSteps.value.forEach((step) => {
    if (step.NextSteps?.length) {
      step.NextSteps.forEach((nextId) => {
        if (nodeMap.has(nextId)) {
          edgeList.push({
            id: `${step.id}-${nextId}`,
            source: step.id,
            target: nextId,
            deletable: true,
            ...defaultEdgeOptions,
          })
        }
      })
    }
  })
  edges.value = edgeList

  // Appliquer l’auto-layout
  setTimeout(() => {
    autoLayout()
  }, 100)
}

function autoLayout() {
  const H_GAP = 250
  const V_GAP = 150
  const visited = new Set<string>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const levels = new Map<number, any[]>()

  // Racines = nœuds sans PreviousSteps
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roots = nodes.value.filter((n: any) => !n.data.hasPrevious)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queue: { node: any; level: number }[] = roots.map((r: any) => ({
    node: r,
    level: 0,
  }))

  while (queue.length) {
    const { node, level } = queue.shift()!
    if (visited.has(node.id)) continue
    visited.add(node.id)

    if (!levels.has(level)) levels.set(level, [])
    levels.get(level)!.push(node)

    // Enfants = tous les nodes pointés par edges
    const children = edges.value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((e: any) => e.source === node.id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((e: any) => nodes.value.find((n: any) => n.id === e.target))
      .filter(Boolean)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children.forEach((child: any) => {
      queue.push({ node: child, level: level + 1 })
    })
  }

  levels.forEach((levelNodes, level) => {
    const totalWidth = (levelNodes.length - 1) * H_GAP
    const startX = -totalWidth / 2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    levelNodes.forEach((node: any, idx: number) => {
      node.position = {
        x: startX + idx * H_GAP,
        y: level * V_GAP,
      }
    })
  })

  setTimeout(() => {
    fitView({ padding: 0.2 })
  }, 50)
}

// Retirer une étape
async function removeStepNode(nodeId: string) {
  try {
    // Appel API pour retirer l'étape de la roadmap
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${props.roadmap.id}/step/${nodeId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression')
    }

    // Retirer de la liste locale seulement si l'API a réussi
    selectedSteps.value = selectedSteps.value.filter((s) => s.id !== nodeId)
    selectedStepIds.value = selectedStepIds.value.filter((id) => id !== nodeId)
    // Mettre à jour le store local
    await userStore.fetchUserSteps()
    // toast.success('Step removed from the roadmap')
  } catch (err) {
    console.error('Erreur suppression étape:', err)
    toast.error('Unable to remove step')
  }
}

// Ajouter une étape
function addStep(step: Step) {
  if (!selectedSteps.value.find((s) => s.id === step.id)) {
    selectedSteps.value = [...selectedSteps.value, step]
  }
}

// Drag & Drop
function onDragStart(event: DragEvent, step: Step) {
  draggedStep.value = step
  isDragging.value = true
  event.dataTransfer!.effectAllowed = 'copy'
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  if (!draggedStep.value) return

  const flowEl = event.currentTarget as HTMLElement
  const rect = flowEl.getBoundingClientRect()
  const pos = {
    x: event.clientX - rect.left - 100,
    y: event.clientY - rect.top - 30,
  }
  addStep(draggedStep.value)
  setTimeout(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node = nodes.value.find((n: any) => n.id === draggedStep.value!.id)
    if (node) node.position = pos
  }, 100)

  draggedStep.value = null
  isDragging.value = false
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onNodesChange(changes: any[]) {
  nodes.value = applyNodeChanges(changes, nodes.value)
}

// Relier les étapes entre-elles
async function onConnect(params: { source: string; target: string }) {
  if (params.source === params.target) return

  const exists = edges.value.some(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => e.source === params.source && e.target === params.target,
  )
  if (exists) return

  const newEdge = {
    id: `${params.source}-${params.target}`,
    source: params.source,
    target: params.target,
    deletable: true,
    ...defaultEdgeOptions,
  }
  edges.value = addEdges([newEdge], edges.value)

  const sourceStep = selectedSteps.value.find((s) => s.id === params.source)
  const targetStep = selectedSteps.value.find((s) => s.id === params.target)

  if (!sourceStep || !targetStep) return

  // Mettre à jour en mémoire
  if (!sourceStep.NextSteps) sourceStep.NextSteps = []
  if (!targetStep.PreviousSteps) targetStep.PreviousSteps = []

  if (!sourceStep.NextSteps.includes(params.target)) {
    sourceStep.NextSteps.push(params.target)
  }
  if (!targetStep.PreviousSteps.includes(params.source)) {
    targetStep.PreviousSteps.push(params.source)
  }

  // Mettre à jour le flag hasPrevious visuellement
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const targetNode = nodes.value.find((n: any) => n.id === params.target)
  if (targetNode) {
    targetNode.data.hasPrevious = true
  }

  // Mettre à jour les deux étapes
  try {
    const updateStep = async (step: Step) => {
      const payload = {
        title: step.title,
        subTitle: step.subTitle || '',
        description: step.description || '',
        PreviousSteps: step.PreviousSteps || [],
        NextSteps: step.NextSteps || [],
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/step/${step.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.token}`,
          },
          body: JSON.stringify(payload),
        },
      )

      if (!response.ok) {
        throw new Error(`Erreur mise à jour étape ${step.title}`)
      }
    }

    await Promise.all([updateStep(sourceStep), updateStep(targetStep)])
    await userStore.fetchUserSteps()
    toast.success('Steps connected')
  } catch (err) {
    console.error('Erreur lors de la mise à jour des steps :', err)
    toast.error('Unable to create connection')

    // Rollback visuel
    edges.value = edges.value.filter((e) => e.id !== newEdge.id)
    sourceStep.NextSteps = sourceStep.NextSteps?.filter((id) => id !== params.target)
    targetStep.PreviousSteps = targetStep.PreviousSteps?.filter((id) => id !== params.source)
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onEdgesChange(changes: any[]) {
  for (const change of changes) {
    if (change.type === 'remove') {
      const edgeId = change.id
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const edgeToRemove = edges.value.find((e: any) => e.id === edgeId)
      if (!edgeToRemove) continue

      const sourceId = edgeToRemove.source
      const targetId = edgeToRemove.target
      const sourceStep = selectedSteps.value.find((s) => s.id === sourceId)!
      const targetStep = selectedSteps.value.find((s) => s.id === targetId)!

      // Retirer de mémoire
      sourceStep.NextSteps = sourceStep.NextSteps?.filter((id) => id !== targetId) || []
      targetStep.PreviousSteps = targetStep.PreviousSteps?.filter((id) => id !== sourceId) || []

      // API : mettre à jour sourceStep
      try {
        await fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/step/${sourceStep.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.token}`,
            },
            body: JSON.stringify({
              NextSteps: sourceStep.NextSteps,
              PreviousSteps: sourceStep.PreviousSteps || [],
            }),
          },
        )

        // API : mettre à jour targetStep
        await fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/step/${targetStep.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.token}`,
            },
            body: JSON.stringify({
              NextSteps: targetStep.NextSteps || [],
              PreviousSteps: targetStep.PreviousSteps,
            }),
          },
        )
        await userStore.fetchUserSteps()
      } catch (err) {
        console.error('Erreur suppression lien step :', err)
        toast.error('Unable to synchronize link deletion.')
      }
    }
  }

  // Appliquer visuel
  edges.value = applyEdgeChanges(changes, edges.value)
}

async function submitStructure() {
  if (structureLoading.value) return
  structureLoading.value = true

  try {
    const stepIds = selectedSteps.value.map((s) => s.id)

    const formData = new FormData()

    // 🔧 CORRECTION : Gérer le cas où il n'y a pas d'étapes
    if (stepIds.length > 0) {
      formData.append('Steps', stepIds.join(','))
    } else {
      // Envoyer explicitement une chaîne vide ou ne pas ajouter le champ
      formData.append('Steps', '') // ou simplement ne pas append du tout
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${props.roadmap.id}/steps`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
        body: formData,
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    toast.success('Roadmap updated with success !')
    await userStore.fetchUserSteps()
    await userStore.fetchUserRoadmaps()
  } catch (err) {
    console.error('Erreur mise à jour Steps :', err)
    toast.error('Unable to update structure.')
  } finally {
    structureLoading.value = false
  }
}
</script>

<style scoped>
.update-roadmap-container {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 1rem;
}

/* Onglets */
.tabs {
  display: flex;
  border-bottom: 2px solid var(--color-medium-gray);
  margin-bottom: var(--spacing-xl);
  background: var(--color-darker-charcoal);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  padding: 0 var(--spacing-md);
}

.tab-button {
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: bold;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  color: var(--color-light-gray);
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: var(--color-cream);
}

.tab-button.active {
  border-bottom-color: var(--color-gold);
  color: var(--color-gold);
}

/* Améliorer le titre de l'onglet étapes */
.tab-content h2 {
  color: var(--color-gold);
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-lg);
}

.flow-info-card {
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.flow-info-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.flow-info-header i {
  color: var(--color-gold);
  font-size: var(--font-size-lg);
}

.flow-info-header h4 {
  color: var(--color-cream);
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  margin: 0;
}

.flow-info-content {
  display: grid;
  gap: var(--spacing-sm);
}

.flow-info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-cream);
  font-size: var(--font-size-sm);
}

.flow-info-item i {
  color: var(--color-gold);
  width: 20px;
  text-align: center;
}

/* Contenu */
.tab-content {
  margin-top: 1rem;
}
.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}
.field {
  display: flex;
  flex-direction: column;
}
.field-row {
  display: flex;
  gap: 2rem;
}
.switch-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.switch-button {
  width: 40px;
  height: 20px;
  background: #ccc;
  border-radius: 10px;
  position: relative;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.switch-button.active {
  background: var(--color-gold);
}
.switch-handle {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  top: 1px;
  left: 1px;
  transition: transform 0.2s;
}
.switch-button.active .switch-handle {
  transform: translateX(20px);
}
.file-input-wrapper {
  position: relative;
}
.file-input {
  display: none;
}
.file-input-button {
  padding: 0.5rem 1rem;
  border: 1px dashed #aaa;
  background: none;
  cursor: pointer;
}
.file-hint {
  font-size: 0.8rem;
  color: #666;
}

.actions-row,
.structure-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
}
.structure-actions {
  margin-bottom: 1rem;
}
.structure-save {
  margin-left: auto;
}
.roadmap-flow {
  width: 100%;
  height: 500px;
  background: #1e1e1e;
  border-radius: 8px;
}

.flow-container {
  height: 600px;
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

.step-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: #2e2e2e;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}
.step-option:hover {
  background: #3e3e3e;
}
.add-icon {
  color: var(--color-gold);
}

.custom-node {
  background: var(--color-dark-gray);
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
  min-width: 150px;
  transition: all 0.2s ease;
}

.custom-node:hover {
  border-color: var(--color-gold);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.custom-node.root-node {
  border-color: var(--color-gold);
  background: var(--color-charcoal);
}

.node-content {
  position: relative;
}

.node-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-cream);
  font-weight: bold;
  font-family: var(--font-primary);
}

.node-header i {
  color: var(--color-gold);
}

.node-actions {
  position: absolute;
  top: -8px;
  right: -8px;
}

.btn-remove {
  background: var(--color-gold);
  color: var(--color-charcoal);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
}

.btn-remove:hover {
  background: #ff4444;
  color: white;
  transform: scale(1.1);
}

/* === Styles spécifiques à l’onglet “Informations de base” === */

.p-multiselect-field {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}

/* Conteneur général */
.update-roadmap-form {
  background: var(--color-darker-charcoal);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Titres de section */
.update-roadmap-form h2 {
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  color: var(--color-gold);
  font-weight: bold;
}

/* Groupe de champs (label + input/textarea) */
.field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
  min-width: 0;
  overflow: hidden;
}
.field label {
  font-size: var(--font-size-base);
  font-family: var(--font-secondary);
  color: var(--color-cream);
  font-weight: bold;
}
.field input,
.field textarea {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  background: var(--color-dark-gray);
  font-size: var(--font-size-base);
  font-family: var(--font-secondary);
  color: var(--color-cream);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;
}
.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--color-gold);
}

/* Rangée de toggles */
.field-row {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}
.switch-field {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
.switch-field label {
  font-size: var(--font-size-base);
  color: var(--color-darker-gray);
}
.switch-button {
  width: 48px;
  height: 24px;
  background: var(--color-medium-gray);
  border-radius: var(--radius-full);
  position: relative;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}
.switch-button.active {
  background: var(--color-gold);
}
.switch-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  background: var(--color-white);
  border-radius: var(--radius-full);
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}
.switch-button.active .switch-handle {
  transform: translateX(24px);
}

/* Options dans les multiselect */
.game-option,
.step-multiselect-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.game-option i,
.step-multiselect-option i {
  color: var(--color-gold);
}

.step-multiselect-option {
  cursor: grab;
}

.step-multiselect-option:active {
  cursor: grabbing;
}

/* Override Multiselect styles */
.multiselect-field {
  width: 100%;
}

/* Supprimer les puces de liste */
.multiselect-field ul,
.multiselect-field li,
.p-multiselect ul,
.p-multiselect li {
  list-style: none !important;
  list-style-type: none !important;
}

.multiselect-field .multiselect__content-wrapper {
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
}

.multiselect-field .multiselect__option {
  background: var(--color-charcoal);
  color: var(--color-cream);
  border: none;
  list-style: none;
}

.multiselect-field .multiselect__option--highlight {
  background: var(--color-dark-gray);
  color: var(--color-gold);
}

/* Upload d’image */
.file-input-wrapper {
  position: relative;
}
.file-input {
  display: none;
}
.file-input-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px dashed var(--color-gold);
  background: var(--color-dark-gray);
  border-radius: var(--radius-md);
  font-family: var(--font-secondary);
  color: var(--color-white);
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;
}
.file-input-button:hover {
  background: var(--color-cream);
  color: var(--color-darker-charcoal);
  border: 2px solid var(--color-dark-gray);
}
.file-hint {
  font-size: var(--font-size-sm);
  color: var(--color-medium-gray);
  margin-top: var(--spacing-xs);
}

/* Boutons d’action */
.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}
.actions-row button {
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition:
    background 0.2s,
    box-shadow 0.2s;
}

/* Bouton Annuler */
.actions-row .pi-times {
  margin-right: var(--spacing-xs);
}
.actions-row button[variant='secondary'] {
  background: var(--color-off-white);
  color: var(--color-medium-gray);
  padding: var(--spacing-md) var(--spacing-xl);
}
.actions-row button[variant='secondary']:hover {
  background: var(--color-light-gray);
}

/* Bouton Enregistrer */
.actions-row #btn-save-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
  color: var(--color-charcoal);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.actions-row #btn-save-info:hover {
  background: linear-gradient(135deg, var(--color-light-yellow), var(--color-gold));
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}
.actions-row #btn-save-info:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Par défaut, masquer le message mobile et afficher le contenu desktop */
.mobile-steps-message {
  display: none;
}

.desktop-steps-content {
  display: block;
}

/* Styles du message mobile */
.mobile-message-card {
  background: var(--color-charcoal);
  border: 2px solid var(--color-gold);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  text-align: center;
  margin: var(--spacing-xl) auto;
  max-width: 500px;
}

.mobile-message-card i {
  font-size: 3rem;
  color: var(--color-gold);
  margin-bottom: var(--spacing-lg);
}

.mobile-message-card h3 {
  font-family: var(--font-primary);
  font-size: var(--font-size-xl);
  color: var(--color-gold);
  margin: 0 0 var(--spacing-md) 0;
}

.mobile-message-card p {
  color: var(--color-cream);
  font-size: var(--font-size-base);
  line-height: 1.6;
  margin: 0 0 var(--spacing-lg) 0;
}

.mobile-message-actions {
  margin-top: var(--spacing-lg);
}

.mobile-back-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-gold);
  color: var(--color-charcoal);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  font-family: var(--font-primary);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-back-button:hover {
  background: var(--color-light-yellow);
  transform: translateY(-2px);
}

/* === Styles pour la prévisualisation de la couverture === */
.cover-preview-wrapper {
  width: 200px;
  height: 120px;
  border: 2px dashed var(--color-medium-gray);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  background: var(--color-off-white);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-preview-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s;
}

.cover-placeholder {
  text-align: center;
  color: var(--color-medium-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
}
.cover-placeholder i {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-xs);
  display: block;
}

/* Responsive général */
@media (max-width: 1024px) {
  .update-roadmap-container {
    padding: var(--spacing-md);
  }

  .tabs {
    padding: 0 var(--spacing-sm);
  }

  .tab-button {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
  }

  /* Sur tablette et mobile, masquer le contenu desktop et afficher le message */
  .mobile-steps-message {
    display: block;
  }

  .desktop-steps-content {
    display: none;
  }
}

@media (max-width: 768px) {
  .update-roadmap-container {
    padding: var(--spacing-sm);
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  /* Onglet Informations - Responsive */
  .update-roadmap-form {
    padding: var(--spacing-lg);
    margin: 0;
    width: 100%;
  }

  .form-section {
    gap: var(--spacing-md);
  }

  .field {
    gap: var(--spacing-xs);
  }

  .update-roadmap-form h2 {
    font-size: var(--font-size-xl);
    text-align: center;
    margin-bottom: var(--spacing-md);
  }

  /* Réorganiser les switchs en colonne sur mobile */
  .field-row {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  /* Adapter la prévisualisation de couverture */
  .cover-preview-wrapper {
    width: 100%;
    max-width: 300px;
    height: 180px;
    margin: 0 auto;
  }

  /* Réorganiser les boutons d'action */
  .actions-row {
    flex-direction: column-reverse;
    gap: var(--spacing-md);
  }

  .actions-row button {
    width: 100%;
    padding: var(--spacing-md);
    font-size: var(--font-size-base);
  }

  .mobile-message-card {
    margin: var(--spacing-lg) auto;
    padding: var(--spacing-xl);
  }

  .mobile-message-card i {
    font-size: 2.5rem;
  }

  .mobile-message-card h3 {
    font-size: var(--font-size-lg);
  }

  .mobile-message-card p {
    font-size: var(--font-size-sm);
  }
}

@media (max-width: 576px) {
  .tabs {
    padding: 0;
  }

  .tab-button {
    flex: 1;
    padding: var(--spacing-sm);
    font-size: var(--font-size-sm);
  }

  .update-roadmap-container {
    padding: var(--spacing-xs);
  }

  .update-roadmap-form {
    padding: var(--spacing-md);
  }

  .update-roadmap-form h2 {
    font-size: var(--font-size-lg);
  }

  /* Adapter les champs pour très petits écrans */
  .field input,
  .field textarea {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
  }

  .field label {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-xs);
  }

  /* Adapter la taille des switchs */
  .switch-button {
    width: 40px;
    height: 20px;
  }

  .switch-handle {
    width: 16px;
    height: 16px;
  }

  .switch-button.active .switch-handle {
    transform: translateX(20px);
  }

  /* Couverture plus petite sur très petits écrans */
  .cover-preview-wrapper {
    width: 100%;
    height: 150px;
  }

  .mobile-message-card {
    margin: var(--spacing-md);
    padding: var(--spacing-lg);
  }

  .mobile-back-button {
    width: 100%;
    justify-content: center;
    padding: var(--spacing-md);
  }
}
</style>
