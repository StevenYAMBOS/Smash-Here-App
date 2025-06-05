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
        Informations de base
      </button>
      <button
        :class="{ active: currentTab === 'structure' }"
        @click="currentTab = 'structure'"
        class="tab-button"
      >
        Structure des étapes
      </button>
    </div>

    <!-- Contenu Onglet “Informations de base” -->
    <div v-if="currentTab === 'info'" class="tab-content">
      <form @submit.prevent="submitInfo" class="update-roadmap-form">
        <h2>Modifier la Roadmap – Informations de base</h2>

        <div class="form-section">
          <div class="field">
            <label for="title">Titre</label>
            <input id="title" v-model="title" type="text" required />
          </div>

          <div class="field">
            <label for="subTitle">Sous-titre</label>
            <input id="subTitle" v-model="subTitle" type="text" />
          </div>

          <div class="field">
            <label for="description">Description</label>
            <textarea id="description" v-model="description" rows="3" required></textarea>
          </div>

          <div class="field-row">
            <div class="switch-field">
              <label for="published-switch">Publié</label>
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
            <label>Jeux associés</label>
            <Multiselect
              v-model="selectedGames"
              :options="availableGames"
              label="title"
              track-by="id"
              placeholder="Sélectionner des jeux"
              multiple
              :close-on-select="false"
              class="multiselect-field"
            />
          </div>

          <div class="field">
            <label for="cover">Image de couverture</label>
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
                {{ coverFile ? coverFile.name : 'Choisir une image' }}
              </button>
            </div>
            <p class="file-hint">Formats acceptés : WEBP, PNG, JPEG (max 10 MB)</p>
          </div>
        </div>

        <div class="actions-row">
          <SubmitButton
            label="Annuler"
            icon="pi pi-times"
            variant="secondary"
            type="button"
            @click="emit('navigate', 'list-roadmaps')"
          />
          <SubmitButton
            id="btn-save-info"
            :label="infoLoading ? 'Enregistrement…' : 'Enregistrer les infos'"
            :disabled="infoLoading"
            icon="pi pi-save"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
    </div>

    <!-- Contenu Onglet “Structure des étapes” -->
    <div v-if="currentTab === 'structure'" class="tab-content">
      <h2>Modifier la Roadmap – Structure des étapes</h2>

      <div class="structure-actions">
        <div class="field">
          <label>Étapes disponibles</label>
          <Multiselect
            v-model="selectedSteps"
            :options="availableSteps"
            label="title"
            track-by="id"
            placeholder="Sélectionner des étapes à ajouter"
            multiple
            :close-on-select="false"
            class="multiselect-field"
          >
            <template #option="slotProps">
              <div class="step-option" @click.stop="addStep(slotProps.option)">
                <i class="pi pi-sitemap"></i>
                <span>{{ slotProps.option.title }}</span>
                <i class="pi pi-plus add-icon"></i>
              </div>
            </template>
          </Multiselect>
        </div>

        <div class="structure-save">
          <SubmitButton
            :label="structureLoading ? 'Enregistrement…' : 'Enregistrer la structure'"
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
                  <span>{{}}</span>
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

          <Background variant="dots" :color="backgroundColor" :gap="16" :size="1" />
          <Controls :show-zoom="true" :show-fit-view="true" :show-interactive="true" />
          <MiniMap :pannable="true" :zoomable="true" />
        </VueFlow>
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
import Multiselect from '@vueform/multiselect'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'
import SubmitButton from './SubmitButton.vue'
import type { Roadmap, Game, Step } from '@/types/collections'

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

// ------------- INFOS DE BASE -------------

const infoLoading = ref(false)
const title = ref(props.roadmap.title)
const subTitle = ref(props.roadmap.subTitle || '')
const description = ref(props.roadmap.description)
const coverFile = ref<File | null>(null)
const published = ref(props.roadmap.published || false)
const premium = ref(props.roadmap.premium || false)
const selectedGames = ref<Game[]>([])

const availableGames = computed(() => userStore.games || [])

// Récupérer les jeux associés initiaux
onMounted(async () => {
  if (!userStore.games?.length) {
    await userStore.fetchAllGames()
  }
  if (props.roadmap.Games?.length) {
    selectedGames.value = availableGames.value.filter((g) => props.roadmap.Games.includes(g.id))
  }
})

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 10 * 1024 * 1024) {
    toast.error('La taille doit être < 10 MB.')
    return
  }
  const validTypes = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg']
  if (!validTypes.includes(file.type)) {
    toast.error('Format invalide (WEBP, PNG, JPEG).')
    return
  }
  coverFile.value = file
}

function triggerFileInput() {
  const fileInput = document.getElementById('cover') as HTMLInputElement
  fileInput?.click()
}

async function submitInfo() {
  if (infoLoading.value) return
  infoLoading.value = true

  try {
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('subTitle', subTitle.value)
    formData.append('description', description.value)
    formData.append('published', published.value.toString())
    formData.append('premium', premium.value.toString())
    formData.append('Games', selectedGames.value.map((g) => g.id).join(','))
    if (coverFile.value) {
      formData.append('cover', coverFile.value)
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${props.roadmap.id}`,
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
    toast.success('Informations mises à jour avec succès !')
  } catch (err) {
    console.error(err)
    toast.error('Échec de la mise à jour des informations.')
  } finally {
    infoLoading.value = false
  }
}

// ------------- STRUCTURE DES ÉTAPES -------------

const structureLoading = ref(false)
const availableSteps = computed(() => userStore.stepsCreated || [])
const selectedSteps = ref<Step[]>([])

// VueFlow state
const isDragging = ref(false)
const draggedStep = ref<Step | null>(null)
const nodes = ref<any[]>([])
const edges = ref<any[]>([])

// Styles VueFlow
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
  const levels = new Map<number, any[]>()

  // Racines = nœuds sans PreviousSteps
  const roots = nodes.value.filter((n: any) => !n.data.hasPrevious)
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
      .filter((e: any) => e.source === node.id)
      .map((e: any) => nodes.value.find((n: any) => n.id === e.target))
      .filter(Boolean)

    children.forEach((child: any) => {
      queue.push({ node: child, level: level + 1 })
    })
  }

  levels.forEach((levelNodes, level) => {
    const totalWidth = (levelNodes.length - 1) * H_GAP
    const startX = -totalWidth / 2
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

function resetFlow() {
  buildFlowFromSteps()
}

function removeStepNode(nodeId: string) {
  selectedSteps.value = selectedSteps.value.filter((s) => s.id !== nodeId)
  // Appel API pour mettre à jour la liste Steps
  submitStructure()
}

function addStep(step: Step) {
  if (!selectedSteps.value.find((s) => s.id === step.id)) {
    selectedSteps.value = [...selectedSteps.value, step]
    // Mise à jour immédiate du backend
    submitStructure()
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
    const node = nodes.value.find((n: any) => n.id === draggedStep.value!.id)
    if (node) node.position = pos
  }, 100)

  draggedStep.value = null
  isDragging.value = false
}

function onNodesChange(changes: any[]) {
  nodes.value = applyNodeChanges(changes, nodes.value)
}

async function onConnect(params: { source: string; target: string }) {
  if (params.source === params.target) return

  const exists = edges.value.some(
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

  const sourceStep = selectedSteps.value.find((s) => s.id === params.source)!
  const targetStep = selectedSteps.value.find((s) => s.id === params.target)!

  // Mettre à jour en mémoire
  sourceStep.NextSteps = sourceStep.NextSteps || []
  if (!sourceStep.NextSteps.includes(params.target)) {
    sourceStep.NextSteps.push(params.target)
  }
  targetStep.PreviousSteps = targetStep.PreviousSteps || []
  if (!targetStep.PreviousSteps.includes(params.source)) {
    targetStep.PreviousSteps.push(params.source)
  }

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
          Roadmaps: sourceStep.Roadmaps.includes(props.roadmap.id)
            ? sourceStep.Roadmaps
            : [...sourceStep.Roadmaps, props.roadmap.id],
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
          Roadmaps: targetStep.Roadmaps.includes(props.roadmap.id)
            ? targetStep.Roadmaps
            : [...targetStep.Roadmaps, props.roadmap.id],
        }),
      },
    )
  } catch (err) {
    console.error('Erreur lors de la mise à jour des steps :', err)
    toast.error('Impossible de synchroniser le lien en base.')
  }
}

async function onEdgesChange(changes: any[]) {
  for (const change of changes) {
    if (change.type === 'remove') {
      const edgeId = change.id
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
      } catch (err) {
        console.error('Erreur suppression lien step :', err)
        toast.error('Impossible de synchroniser la suppression du lien.')
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
    await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${props.roadmap.id}/steps`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.token}`,
        },
        body: JSON.stringify({ Steps: stepIds }),
      },
    )
    toast.success('Structure de la roadmap enregistrée !')
  } catch (err) {
    console.error('Erreur mise à jour Steps :', err)
    toast.error('Impossible de mettre à jour la structure.')
  } finally {
    structureLoading.value = false
  }
}
</script>

<style scoped>
.update-roadmap-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

/* Onglets */
.tabs {
  display: flex;
  border-bottom: 2px solid #ddd;
  margin-bottom: 1rem;
}
.tab-button {
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}
.tab-button.active {
  border-bottom-color: var(--color-gold);
  color: var(--color-gold);
}

/* Contenu */
.tab-content {
  margin-top: 1rem;
}
.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
.multiselect-field {
  width: 100%;
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
.flow-container.dragging {
  cursor: grabbing;
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
  background: #444;
  border-radius: 6px;
  padding: 0.5rem;
  color: #fff;
  min-width: 120px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.custom-node.root-node {
  border: 2px solid var(--color-gold);
}
.node-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.node-actions {
  position: absolute;
  top: 4px;
  right: 4px;
}
.btn-remove {
  border: none;
  background: none;
  color: #ff5c5c;
  cursor: pointer;
}
</style>
