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
            <label>Roadmap's games</label>
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

/* +++++++++++++++++++++++++++++ INFOS DE BASE +++++++++++++++++++++++++++++ */

const infoLoading = ref(false)
const title = ref(props.roadmap.title)
const subTitle = ref(props.roadmap.subTitle || '')
const description = ref(props.roadmap.description)
const coverFile = ref<File | null>(null)
const published = ref(props.roadmap.published || false)
const premium = ref(props.roadmap.premium || false)
const selectedGames = ref<Game[]>([])
const availableGames = computed(() => userStore.games || [])

// Récupération de données
onMounted(async () => {
  coverPreview.value = props.roadmap.cover || null

  if (!userStore.games?.length) {
    await userStore.fetchAllGames()
  }
  if (props.roadmap.Games?.length) {
    selectedGames.value = availableGames.value.filter((g) => props.roadmap.Games.includes(g.id))
  }
})

// URL de prévisualisation de la couverture
const coverPreview = ref<string | null>(null)

// Gestion de l'image
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Validation taille et type
  if (file.size > 10 * 1024 * 1024) {
    toast.error('La taille doit être < 10 MB.')
    return
  }
  const validTypes = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg']
  if (!validTypes.includes(file.type)) {
    toast.error('Format invalide (WEBP, PNG, JPEG).')
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
    formData.append('premium', premium.value.toString())
    formData.append('Games', selectedGames.value.map((g) => g.id).join(','))
    if (coverFile.value) {
      formData.append('cover', coverFile.value)
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${props.roadmap.id}/info`,
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
    toast.success('Roadmap updated !')
    await userStore.fetchProfile()
    emit('navigate', 'list-roadmaps')
  } catch (err) {
    console.error(err)
    toast.error('Error during update')
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
  width: 100%;
  max-width: 1500px;
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

/* === Styles spécifiques à l’onglet “Informations de base” === */

/* Conteneur général */
.update-roadmap-form {
  background: var(--color-darker-charcoal);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
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

/* Multiselect */
.multiselect-field {
  width: 100%;
  font-family: var(--font-secondary);
}
.multiselect-field .multiselect__tags {
  background: var(--color-off-white);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-light-gray);
}
.multiselect-field .multiselect__tags,
.multiselect-field .multiselect__input {
  padding: var(--spacing-sm);
}
.multiselect-field .multiselect__option--highlight {
  background: var(--color-light-yellow);
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
}
.actions-row button[variant='secondary']:hover {
  background: var(--color-light-gray);
}

/* Bouton Enregistrer */
.actions-row #btn-save-info {
  background: var(--color-gold);
  color: var(--color-darker-charcoal);
}
.actions-row #btn-save-info:hover {
  opacity: 80%;
}
.actions-row #btn-save-info:disabled {
  background: var(--color-light-gray);
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .update-roadmap-form {
    padding: var(--spacing-lg);
  }
  .field-row {
    flex-direction: column;
  }
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
</style>
