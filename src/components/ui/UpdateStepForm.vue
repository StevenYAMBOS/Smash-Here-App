<!-- src/components/ui/UpdateRoadmapForm.vue -->

<template>
  <div class="update-roadmap-container">
    <form @submit.prevent="submit" class="update-roadmap-form">
      <h2>Edit Roadmap</h2>

      <!-- Section 1: Informations de base -->
      <div class="form-section">
        <h3>Basic Information</h3>

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

        <div class="field">
          <label for="cover">Cover Image</label>
          <div class="file-input-wrapper">
            <input
              id="cover"
              type="file"
              accept="image/webp,image/png,image/jpeg"
              @change="handleFileChange"
              class="file-input"
            />
            <button type="button" class="file-input-button" @click="triggerFileInput">
              <i class="pi pi-upload"></i>
              {{ coverFile ? coverFile.name : 'Choose an image' }}
            </button>
          </div>
          <p class="file-hint">Accepted formats: WEBP, PNG, JPEG (max 10MB)</p>
        </div>

        <!-- Prévisualisation de l'image -->
        <!-- <div v-if="props.roadmap.cover || coverFile" class="image-preview">
          <img
            :src="coverFile ? URL.createObjectURL(coverFile) : props.roadmap.cover"
            alt="Cover preview"
            class="preview-img"
          />
          <button v-if="coverFile" type="button" @click="removeCover" class="remove-image-btn">
            <i class="pi pi-times"></i>
          </button>
        </div> -->

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

          <div class="switch-field">
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
          </div>
        </div>

        <div class="field">
          <label>Associated Games</label>
          <Multiselect
            v-model="selectedGames"
            :options="availableGames"
            label="title"
            track-by="id"
            placeholder="Select games"
            multiple
            :close-on-select="false"
            class="multiselect-field"
          />
        </div>
      </div>

      <!-- Section 2: Gestion des étapes -->
      <div class="form-section">
        <h3>Roadmap Structure</h3>

        <!-- Sélection des étapes -->
        <div class="field">
          <label>Available Steps (Click or drag to add)</label>
          <Multiselect
            v-model="selectedSteps"
            :options="availableSteps"
            label="title"
            track-by="id"
            placeholder="Select steps to include in this roadmap"
            multiple
            :close-on-select="false"
            class="multiselect-field"
          >
            <template #option="slotProps">
              <div
                class="step-option"
                draggable="true"
                @dragstart="onDragStart($event, slotProps.option)"
                @click.stop="addStepToFlow(slotProps.option)"
              >
                <i class="pi pi-sitemap"></i>
                <span>{{ slotProps.option.title }}</span>
                <i class="pi pi-plus add-icon"></i>
              </div>
            </template>
          </Multiselect>
        </div>

        <!-- Visualisation avec VueFlow -->
        <div v-if="selectedSteps.length > 0" class="flow-section">
          <div class="flow-header">
            <h4>Step Organization</h4>
            <div class="flow-actions">
              <button type="button" @click.stop="autoLayout" class="btn-secondary">
                <i class="pi pi-refresh"></i> Auto Layout
              </button>
              <button type="button" @click.stop="resetFlow" class="btn-secondary">
                <i class="pi pi-replay"></i> Reset
              </button>
            </div>
          </div>

          <div
            class="flow-container"
            :class="{ dragging: isDragging }"
            @click.stop
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
                        @click.stop="removeNode(id)"
                        class="btn-remove"
                        title="Remove from roadmap"
                      >
                        <i class="pi pi-times"></i>
                      </button>
                    </div>
                  </div>

                  <Handle type="source" :position="Position.Bottom" :style="handleStyle" />
                </div>
              </template>

              <Background variant="dots" :color="backgroundColor" :gap="16" :size="1" />
              <Controls :show-zoom="true" :show-fit-view="true" :show-interactive="true" />
              <MiniMap :pannable="true" :zoomable="true" />
            </VueFlow>
          </div>

          <div class="flow-info">
            <p>
              <i class="pi pi-info-circle"></i> Drag nodes to reposition. Connect nodes by dragging
              from one handle to another. Click on edges to remove them.
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-row">
        <SubmitButton
          label="Cancel"
          icon="pi pi-times"
          variant="secondary"
          type="button"
          @click="emit('navigate', 'list-roadmaps')"
        />
        <SubmitButton
          :label="loading ? 'Saving…' : 'Save Changes'"
          :disabled="loading"
          icon="pi pi-save"
          variant="primary"
          type="submit"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { VueFlow, useVueFlow, Position, Handle, MarkerType } from '@vue-flow/core'
import { Background, Controls, MiniMap } from '@vue-flow/additional-components'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import Multiselect from '@vueform/multiselect'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'
import SubmitButton from './SubmitButton.vue'
import type { Roadmap, Game, Step } from '@/types/collections'

const toast = useToast()
const userStore = useUserStore()
const { fitView, addEdges, applyNodeChanges, applyEdgeChanges } = useVueFlow()

// Drag & drop state
const isDragging = ref(false)
const draggedStep = ref<Step | null>(null)

const props = defineProps<{
  roadmap: Roadmap
}>()

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()

// Form data
const loading = ref(false)
const title = ref(props.roadmap.title)
const subTitle = ref(props.roadmap.subTitle || '')
const description = ref(props.roadmap.description)
const coverFile = ref<File | null>(null)
const published = ref(props.roadmap.published || false)
const premium = ref(props.roadmap.premium || false)
const selectedGames = ref<Game[]>([])
const selectedSteps = ref<Step[]>([])

// VueFlow dat
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodes = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const edges = ref<any[]>([])

// VueFlow styling
const backgroundColor = '#333333'
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

// Computed
const availableSteps = computed(() => userStore.stepsCreated || [])
const availableGames = computed(() => userStore.games || [])

// Initialize data
onMounted(async () => {
  // Fetch necessary data
  if (!userStore.stepsCreated?.length) {
    await userStore.fetchUserSteps()
  }
  if (!userStore.games?.length) {
    await userStore.fetchAllGames()
  }

  // Set selected games
  if (props.roadmap.Games?.length) {
    selectedGames.value = availableGames.value.filter((g) => props.roadmap.Games.includes(g.id))
  }

  // Set selected steps and build flow
  if (props.roadmap.Steps?.length) {
    selectedSteps.value = availableSteps.value.filter((s) => props.roadmap.Steps.includes(s.id))
    buildFlowFromSteps()
  }

  if (props.roadmap.Steps?.length) {
    selectedSteps.value = availableSteps.value.filter(s => props.roadmap.Steps.includes(s.id))
    buildFlowFromSteps() // Affecte nodes[] et edges[] en fonction de NextSteps/PreviousSteps
  }
})

// Watch for step selection changes
watch(selectedSteps, (newSteps) => {
  if (newSteps.length > 0) {
    buildFlowFromSteps()
  } else {
    nodes.value = []
    edges.value = []
  }
})

// Build VueFlow graph from selected steps
function buildFlowFromSteps() {
  const nodeMap = new Map()

  // Create nodes
  selectedSteps.value.forEach((step) => {
    const node = {
      id: step.id,
      type: 'custom',
      position: { x: 0, y: 0 }, // Will be calculated by auto-layout
      data: {
        id: step.id,
        label: step.title,
        hasPrevious: step.PreviousSteps?.length > 0,
      },
    }
    nodeMap.set(step.id, node)
  })

  nodes.value = Array.from(nodeMap.values())

  // Create edges based on NextSteps relationships
  const edgeList: any = []
  selectedSteps.value.forEach((step) => {
    if (step.NextSteps?.length) {
      step.NextSteps.forEach((nextId) => {
        // Only create edge if both nodes are in the roadmap
        if (nodeMap.has(nextId)) {
          edgeList.push({
            id: `${step.id}-${nextId}`,
            source: step.id,
            target: nextId,
            deletable: true, // Ajouter cette ligne
            ...defaultEdgeOptions,
          })
        }
      })
    }
  })

  edges.value = edgeList

  // Apply auto-layout after a brief delay
  setTimeout(() => {
    autoLayout()
  }, 100)
}

// Auto-layout algorithm (simple hierarchical layout)
function autoLayout() {
  const HORIZONTAL_GAP = 250
  const VERTICAL_GAP = 150
  const visited = new Set()
  const levels = new Map()

  // Find root nodes (no previous steps)
  const roots = nodes.value.filter((node: { data: { hasPrevious: any } }) => !node.data.hasPrevious)

  // BFS to assign levels
  const queue = roots.map((r: any) => ({ node: r, level: 0 }))

  while (queue.length > 0) {
    const { node, level } = queue.shift()

    if (visited.has(node.id)) continue
    visited.add(node.id)

    if (!levels.has(level)) {
      levels.set(level, [])
    }
    levels.get(level).push(node)

    // Find children
    const children = edges.value

      .filter((e: any) => e.source === node.id)

      .map((e: any) => nodes.value.find((n: { id: any }) => n.id === e.target))
      .filter(Boolean)

    children.forEach((child: any) => {
      queue.push({ node: child, level: level + 1 })
    })
  }

  // Position nodes
  levels.forEach((levelNodes, level) => {
    const totalWidth = (levelNodes.length - 1) * HORIZONTAL_GAP
    const startX = -totalWidth / 2

    levelNodes.forEach((node: { position: { x: number; y: number } }, index: number) => {
      node.position = {
        x: startX + index * HORIZONTAL_GAP,
        y: level * VERTICAL_GAP,
      }
    })
  })

  // Fit view to show all nodes
  setTimeout(() => {
    fitView({ padding: 0.2 })
  }, 50)
}

// Reset flow to initial state
function resetFlow() {
  buildFlowFromSteps()
}

// Remove node from flow
function removeNode(nodeId: string) {
  selectedSteps.value = selectedSteps.value.filter((s) => s.id !== nodeId)
}

// Drag & drop functions
function onDragStart(event: DragEvent, step: Step) {
  draggedStep.value = step
  isDragging.value = true
  event.dataTransfer!.effectAllowed = 'copy'
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  if (!draggedStep.value) return

  // Get drop position relative to the flow container
  const flowElement = event.currentTarget as HTMLElement
  const rect = flowElement.getBoundingClientRect()
  const position = {
    x: event.clientX - rect.left - 100, // Center the node
    y: event.clientY - rect.top - 30,
  }

  addStepToFlow(draggedStep.value, position)

  draggedStep.value = null
  isDragging.value = false
}

// Add step to flow (from click or drop)
function addStepToFlow(step: Step, position?: { x: number; y: number }) {
  // Check if step is already in selectedSteps
  if (!selectedSteps.value.find((s) => s.id === step.id)) {
    selectedSteps.value = [...selectedSteps.value, step]
  }

  // If position is provided (from drop), update node position
  if (position) {
    setTimeout(() => {
      const node = nodes.value.find((n: { id: string }) => n.id === step.id)
      if (node) {
        node.position = position
      }
    }, 100)
  }
}

// File handling functions
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    // Validate file type
    const validTypes = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (WEBP, PNG, or JPEG)')
      return
    }

    coverFile.value = file
  }
}

function triggerFileInput() {
  const fileInput = document.getElementById('cover') as HTMLInputElement
  fileInput?.click()
}

function removeCover() {
  coverFile.value = null
  const fileInput = document.getElementById('cover') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

// Handle node position change
function onNodesChange(changes: any) {
  nodes.value = applyNodeChanges(changes, nodes.value)
}

// Handle edge changes (including removal
function onEdgesChange(changes: any[]) {
  // Process edge removals first
  changes.forEach((change: { type: string; id: any }) => {
    if (change.type === 'remove') {
      const edgeToRemove = edges.value.find((e: any) => e.id === change.id)
      if (edgeToRemove) {
        // Update step relationships
        const sourceStep = selectedSteps.value.find((s) => s.id === edgeToRemove.source)
        const targetStep = selectedSteps.value.find((s) => s.id === edgeToRemove.target)

        if (sourceStep && targetStep) {
          // Remove from NextSteps
          if (sourceStep.NextSteps) {
            sourceStep.NextSteps = sourceStep.NextSteps.filter((id) => id !== edgeToRemove.target)
          }

          // Remove from PreviousSteps
          if (targetStep.PreviousSteps) {
            targetStep.PreviousSteps = targetStep.PreviousSteps.filter(
              (id) => id !== edgeToRemove.source,
            )
          }

          // Update hasPrevious flag if no more previous steps
          if (!targetStep.PreviousSteps || targetStep.PreviousSteps.length === 0) {
            const targetNode = nodes.value.find((n: { id: any }) => n.id === edgeToRemove.target)
            if (targetNode) {
              targetNode.data.hasPrevious = false
            }
          }
        }
      }
    }

    // Exemple dans la boucle de process edge removals :
const sourceId = edgeToRemove.source
const targetId = edgeToRemove.target

// Mettez à jour en base pour le source
await fetch(`${import.meta.env.VITE_API_URL}/step/${sourceId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userStore.token}`,
  },
  body: JSON.stringify({
    NextSteps: sourceStep.NextSteps,        // nouveau tableau sans target
    PreviousSteps: sourceStep.PreviousSteps // idem
  }),
})

// Puis pour le target
await fetch(`${import.meta.env.VITE_API_URL}/step/${targetId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userStore.token}`,
  },
  body: JSON.stringify({
    NextSteps: targetStep.NextSteps,
    PreviousSteps: targetStep.PreviousSteps, // sans source
  }),
})

  })

  // Apply all changes
  edges.value = applyEdgeChanges(changes, edges.value)
}

// Handle new edge creation
function onConnect(params: { source: string; target: string }) {
  // Prevent self-connections
  if (params.source === params.target) return

  // Check if connection already exists
  const existingEdge = edges.value.find(
    (e: any) => e.source === params.source && e.target === params.target,
  )
  if (existingEdge) return

  // Create new edge
  const newEdge = {
    id: `${params.source}-${params.target}`,
    source: params.source,
    target: params.target,
    deletable: true, // Ajouter cette ligne
    ...defaultEdgeOptions,
  }

  edges.value = addEdges([newEdge], edges.value)

  // Update step relationships
  const sourceStep = selectedSteps.value.find((s) => s.id === params.source)
  const targetStep = selectedSteps.value.find((s) => s.id === params.target)

  if (sourceStep && targetStep) {
    if (!sourceStep.NextSteps) {
      sourceStep.NextSteps = []
    }
    if (!sourceStep.NextSteps.includes(params.target)) {
      sourceStep.NextSteps.push(params.target)
    }

    // Update target's PreviousSteps
    if (!targetStep.PreviousSteps) {
      targetStep.PreviousSteps = []
    }
    if (!targetStep.PreviousSteps.includes(params.source)) {
      targetStep.PreviousSteps.push(params.source)
    }

    // Update hasPrevious flag for visual feedback

    const targetNode = nodes.value.find((n: { id: any }) => n.id === params.target)
    if (targetNode) {
      targetNode.data.hasPrevious = true
    }
  }

  // Appel back‐end pour persister la nouvelle relation de sourceStep
await fetch(`${import.meta.env.VITE_API_URL}/step/${params.source}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userStore.token}`,
  },
  body: JSON.stringify({
    NextSteps: sourceStep.NextSteps,
    PreviousSteps: sourceStep.PreviousSteps || [], // souvent vide
    // (et Roadmaps si vous souhaitez l’ajouter ici)
  }),
})

// Appel back‐end pour persister la nouvelle relation de targetStep
await fetch(`${import.meta.env.VITE_API_URL}/step/${params.target}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userStore.token}`,
  },
  body: JSON.stringify({
    NextSteps: targetStep.NextSteps || [], // souvent vide
    PreviousSteps: targetStep.PreviousSteps,
  }),
})

}

// Submit form
async function submit(event) {
    // Si on arrive là parce qu’on a cliqué sur un bouton autre que « Save Changes », on ignore :
    if (!event.submitter || event.submitter.id !== 'btn-save-changes') {
    return;
  }
  loading.value = true

  try {
    // 1. Update roadmap basic info with FormData
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('subTitle', subTitle.value)
    formData.append('description', description.value)
    formData.append('published', published.value.toString())
    formData.append('premium', premium.value.toString())

    // Add cover image if selected
    if (coverFile.value) {
      formData.append('cover', coverFile.value)
    }

    // Add arrays as comma-separated strings
    if (selectedGames.value.length > 0) {
      formData.append('Games', selectedGames.value.map((g) => g.id).join(','))
    }
    if (selectedSteps.value.length > 0) {
      formData.append('Steps', selectedSteps.value.map((s) => s.id).join(','))
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${props.roadmap.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userStore.token}`,
          // Ne PAS ajouter Content-Type, le navigateur le fera automatiquement avec la boundary
        },
        body: formData,
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 2. Update each step's relationships based on the flow
    for (const step of selectedSteps.value) {
      // Get current relationships from edges
      const nextSteps = edges.value
        .filter((e: any) => e.source === step.id)
        .map((e: any) => e.target)

      const previousSteps = edges.value
        .filter((e: any) => e.target === step.id)
        .map((e: any) => e.source)

      // Update Roadmaps field to include this roadmap
      const stepRoadmaps = step.Roadmaps || []
      if (!stepRoadmaps.includes(props.roadmap.id)) {
        stepRoadmaps.push(props.roadmap.id)
      }

      const stepPayload = {
        title: step.title,
        subTitle: step.subTitle || '',
        description: step.description || '',
        PreviousSteps: previousSteps,
        NextSteps: nextSteps,
        Roadmaps: stepRoadmaps,
      }

      await fetch(
        `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/step/${step.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.token}`,
          },
          body: JSON.stringify(stepPayload),
        },
      )
    }

    await fetch(`/step/${params.source}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ NextSteps: sourceStep.NextSteps, PreviousSteps: sourceStep.PreviousSteps, /* et Roadmaps si besoin */ })
})
await fetch(`/step/${params.target}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ NextSteps: targetStep.NextSteps, PreviousSteps: targetStep.PreviousSteps, /* Roadmaps si besoin */ })
})


    // Update local store
    await userStore.fetchProfile()

    toast.success('Roadmap updated successfully!')
    emit('navigate', 'list-roadmaps')
  } catch (err) {
    console.error(err)
    toast.error('Failed to update roadmap')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.update-roadmap-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.update-roadmap-form {
  background: var(--color-darker-charcoal);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.update-roadmap-form h2 {
  color: var(--color-cream);
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-xl);
}

/* Form sections */
.form-section {
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-medium-gray);
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: var(--spacing-lg);
}

.form-section h3 {
  color: var(--color-gold);
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-lg);
}

/* Form fields */
.field {
  margin-bottom: var(--spacing-lg);
}

.field label {
  display: block;
  color: var(--color-cream);
  font-size: var(--font-size-sm);
  font-weight: bold;
  margin-bottom: var(--spacing-sm);
}

.field input[type='text'],
.field input[type='url'],
.field textarea {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-medium-gray);
  background: var(--color-charcoal);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.field input[type='text']:focus,
.field input[type='url']:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--color-gold);
  background: var(--color-dark-gray);
}

/* Checkbox row */
.field-row {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
}

.checkbox-label {
  display: flex;
  align-items: center;
  color: var(--color-cream);
  cursor: pointer;
}

.checkbox-label input[type='checkbox'] {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: var(--spacing-sm);
  accent-color: var(--color-gold);
}

/* Multiselect styling */
.multiselect-field {
  width: 100%;
}

.step-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.step-option i {
  color: var(--color-gold);
}

/* VueFlow section */
.flow-section {
  margin-top: var(--spacing-xl);
  background: var(--color-charcoal);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

.flow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.flow-header h4 {
  color: var(--color-cream);
  font-size: var(--font-size-base);
  margin: 0;
}

.flow-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-secondary {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-dark-gray);
  color: var(--color-cream);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: all 0.2s ease;
  font-family: var(--font-secondary);
}

.btn-secondary:hover {
  background: var(--color-medium-gray);
  border-color: var(--color-gold);
}

.flow-container {
  height: 500px;
  background: var(--color-darker-charcoal);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-medium-gray);
  overflow: hidden;
  position: relative;
}

.roadmap-flow {
  width: 100%;
  height: 100%;
}

/* Custom node styling */
.custom-node {
  background: var(--color-dark-gray);
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-sm);
  min-width: 180px;
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
  padding: var(--spacing-sm) var(--spacing-md);
}

.node-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-cream);
  font-weight: bold;
  font-size: var(--font-size-sm);
}

.node-header i {
  color: var(--color-gold);
  font-size: var(--font-size-sm);
}

.node-actions {
  margin-top: var(--spacing-xs);
  display: flex;
  justify-content: flex-end;
}

.btn-remove {
  background: transparent;
  border: none;
  color: var(--color-light-gray);
  cursor: pointer;
  padding: 2px 4px;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  font-size: var(--font-size-xs);
}

.btn-remove:hover {
  background: rgba(255, 0, 0, 0.2);
  color: #ff4444;
}

.flow-info {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 215, 0, 0.1);
  border-radius: var(--radius-sm);
  color: var(--color-cream);
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.flow-info i {
  color: var(--color-gold);
}

/* Action buttons */
.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

/* Override VueFlow theme */
:deep(.vue-flow) {
  background: var(--color-darker-charcoal);
}

:deep(.vue-flow__background) {
  background: var(--color-darker-charcoal);
}

:deep(.vue-flow__minimap) {
  background: var(--color-darker-charcoal);
  border: 1px solid var(--color-medium-gray);
}

:deep(.vue-flow__minimap-node) {
  fill: var(--color-gold);
}

:deep(.vue-flow__minimap-mask) {
  fill: var(--color-charcoal);
  fill-opacity: 0.8;
}

:deep(.vue-flow__controls) {
  background: var(--color-dark-gray);
  border: 1px solid var(--color-medium-gray);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

:deep(.vue-flow__controls-button) {
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
  color: var(--color-cream);
  width: 32px;
  height: 32px;
  transition: all 0.2s ease;
}

:deep(.vue-flow__controls-button:hover) {
  background: var(--color-medium-gray);
  border-color: var(--color-gold);
}

:deep(.vue-flow__controls-button svg) {
  fill: currentColor;
}

:deep(.vue-flow__edge-path) {
  stroke: var(--color-gold);
  stroke-width: 2;
}

:deep(.vue-flow__edge.animated path) {
  stroke-dasharray: 5 5;
  animation: dash 0.5s linear infinite;
}

@keyframes dash {
  from {
    stroke-dashoffset: 10;
  }
  to {
    stroke-dashoffset: 0;
  }
}

:deep(.vue-flow__edge.selected .vue-flow__edge-path) {
  stroke: var(--color-light-yellow);
  stroke-width: 3;
}

:deep(.vue-flow__handle) {
  background: var(--color-gold);
  border: 2px solid var(--color-charcoal);
  width: 12px;
  height: 12px;
}

:deep(.vue-flow__handle:hover) {
  background: var(--color-light-yellow);
  transform: scale(1.2);
}

:deep(.vue-flow__connection-path) {
  stroke: var(--color-gold);
  stroke-width: 2;
}

:deep(.vue-flow__background-pattern-dots) {
  fill: var(--color-medium-gray);
}

/* Multiselect overrides */
:deep(.multiselect) {
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
  color: var(--color-cream);
  font-family: var(--font-secondary);
}

:deep(.multiselect__tags) {
  background: var(--color-charcoal);
  border: none;
  padding: var(--spacing-xs);
}

:deep(.multiselect__tag) {
  background: var(--color-gold);
  color: var(--color-charcoal);
  font-weight: bold;
  padding: 4px 8px;
  margin-right: var(--spacing-xs);
}

:deep(.multiselect__tag-icon:hover) {
  background: var(--color-light-yellow);
}

:deep(.multiselect__placeholder) {
  color: var(--color-light-gray);
}

:deep(.multiselect__input) {
  background: transparent;
  color: var(--color-cream);
}

:deep(.multiselect__content-wrapper) {
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
  margin-top: 2px;
}

:deep(.multiselect__option) {
  background: var(--color-charcoal);
  color: var(--color-cream);
  padding: var(--spacing-sm) var(--spacing-md);
  transition: all 0.2s ease;
}

:deep(.multiselect__option--highlight) {
  background: var(--color-dark-gray);
  color: var(--color-gold);
}

:deep(.multiselect__option--selected) {
  background: var(--color-gold);
  color: var(--color-charcoal);
  font-weight: bold;
}

:deep(.multiselect__option--selected.multiselect__option--highlight) {
  background: var(--color-light-yellow);
  color: var(--color-charcoal);
}

/* Remove default focus styles and add custom ones */
:deep(.multiselect--active) {
  border-color: var(--color-gold);
}

:deep(.multiselect__select) {
  background: transparent;
}

:deep(.multiselect__select:before) {
  border-color: var(--color-cream) transparent transparent;
}

:deep(.multiselect--active .multiselect__select:before) {
  border-color: transparent transparent var(--color-cream);
}

/* Drag & drop styles */
.step-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
  cursor: grab;
  position: relative;
}

.step-option:active {
  cursor: grabbing;
}

.add-icon {
  margin-left: auto;
  color: var(--color-gold);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.step-option:hover .add-icon {
  opacity: 1;
}

/* Selected edge style */
:deep(.vue-flow__edge.selected) {
  cursor: pointer;
}

:deep(.vue-flow__edge.selected .vue-flow__edge-path) {
  stroke: var(--color-light-yellow);
  stroke-width: 3;
  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.5));
}

/* Visual feedback during drag */
.flow-container.dragging {
  border-color: var(--color-gold);
  background: rgba(255, 215, 0, 0.05);
}
/* Switch button styles */
.switch-field {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.switch-field label {
  color: var(--color-cream);
  font-size: var(--font-size-sm);
  font-weight: bold;
  margin: 0;
}

.switch-button {
  position: relative;
  width: 48px;
  height: 24px;
  background: var(--color-medium-gray);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 0;
}

.switch-button:hover {
  background: var(--color-light-gray);
}

.switch-button.active {
  background: var(--color-gold);
}

.switch-button.active:hover {
  background: var(--color-light-yellow);
}

.switch-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: var(--color-cream);
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch-button.active .switch-handle {
  transform: translateX(24px);
}

/* Drag & drop styles */
.step-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
  cursor: grab;
  position: relative;
}

.step-option:active {
  cursor: grabbing;
}

.add-icon {
  margin-left: auto;
  color: var(--color-gold);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.step-option:hover .add-icon {
  opacity: 1;
}

/* Selected edge style */
:deep(.vue-flow__edge.selected) {
  cursor: pointer;
}

:deep(.vue-flow__edge.selected .vue-flow__edge-path) {
  stroke: var(--color-light-yellow);
  stroke-width: 3;
  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.5));
}

/* Visual feedback during drag */
.flow-container.dragging {
  border-color: var(--color-gold);
  background: rgba(255, 215, 0, 0.05);
}

/* File input styles */
.file-input-wrapper {
  position: relative;
  width: 100%;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.file-input-button {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-sm);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all 0.2s ease;
}

.file-input-button:hover {
  border-color: var(--color-gold);
  background: var(--color-dark-gray);
}

.file-input-button i {
  color: var(--color-gold);
}

.file-hint {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-light-gray);
}

/* Switch button styles */
.switch-field {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.switch-field label {
  color: var(--color-cream);
  font-size: var(--font-size-sm);
  font-weight: bold;
  margin: 0;
}

.switch-button {
  position: relative;
  width: 48px;
  height: 24px;
  background: var(--color-medium-gray);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 0;
}

.switch-button:hover {
  background: var(--color-light-gray);
}

.switch-button.active {
  background: var(--color-gold);
}

.switch-button.active:hover {
  background: var(--color-light-yellow);
}

.switch-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: var(--color-cream);
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch-button.active .switch-handle {
  transform: translateX(24px);
}

/* File input styles */
.file-input-wrapper {
  position: relative;
  width: 100%;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.file-input-button {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-sm);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all 0.2s ease;
}

.file-input-button:hover {
  border-color: var(--color-gold);
  background: var(--color-dark-gray);
}

.file-input-button i {
  color: var(--color-gold);
}

.file-hint {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-light-gray);
}

/* Image preview */
.image-preview {
  margin-top: var(--spacing-md);
  position: relative;
  display: inline-block;
}

.preview-img {
  max-width: 200px;
  max-height: 150px;
  border-radius: var(--radius-sm);
  border: 2px solid var(--color-medium-gray);
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
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
}

.remove-image-btn:hover {
  background: var(--color-light-yellow);
  transform: scale(1.1);
}

/* Drag & drop styles */
.step-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
  cursor: grab;
  position: relative;
}

.step-option:active {
  cursor: grabbing;
}

.add-icon {
  margin-left: auto;
  color: var(--color-gold);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.step-option:hover .add-icon {
  opacity: 1;
}

/* Visual feedback during drag */
.flow-container.dragging {
  border-color: var(--color-gold);
  background: rgba(255, 215, 0, 0.05);
}
</style>