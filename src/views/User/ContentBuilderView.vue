<!-- src/views/User/ContentBuilderView.vue -->

<template>
  <div class="builder-page">
    <ContentBuilderMenu v-model:selected="selectedTab" @navigate="onNavigate" />

    <div class="builder-content">
      <!-- ***************** ROADMAPS ***************** -->
      <template v-if="selectedTab === 'create-roadmap'">
        <h2>Create a new roadmap</h2>
        <CreateRoadmapForm />
      </template>
      <template v-else-if="selectedTab === 'list-roadmaps'">
        <h2>Your roadmaps</h2>
        <SearchBar placeholder="Search for your roadmaps" v-model="searchText" />

        <UserRoadmapCard
          v-for="rm in filteredRoadmaps"
          :key="rm.id"
          :roadmap="rm"
          :showStats="true"
          :showEdit="true"
          :showDelete="true"
          @stats="(id) => router.push(`/dashboard/roadmpas/${id}`)"
          @edit="onEditRoadmap"
          @delete="openConfirm"
        />
      </template>
      <!-- Onglet fantôme pour l'édition -->
      <template v-else-if="selectedTab === 'update-roadmap'">
        <UpdateRoadmapForm v-if="editingRoadmap" :roadmap="editingRoadmap" @navigate="onNavigate" />
      </template>
      <!-- zone modale de confirmation -->
      <div v-if="confirmVisible" class="confirm-backdrop" @click="cancelDelete"></div>
      <div v-if="confirmVisible" class="confirm-modal">
        <p>Are you sure you want to delete this roadmap ?</p>
        <div class="confirm-actions">
          <button class="btn-yes" @click="proceedDeleteRoadmap">Yes</button>
          <button class="btn-no" @click="cancelDelete">No</button>
        </div>
      </div>

      <!-- ***************** ÉTAPES ***************** -->
      <template v-if="selectedTab === 'create-step'">
        <h2>Create a new step</h2>
        <CreateStepForm />
      </template>
      <template v-else-if="selectedTab === 'list-steps'">
        <h2>Your steps</h2>
        <SearchBar placeholder="Search for your roadmaps" v-model="searchText" />

        <UserStepCard
          v-for="rm in filteredSteps"
          :key="rm.id"
          :step="rm"
          :showStats="true"
          :showEdit="true"
          :showDelete="true"
          @stats="(id) => router.push(`/dashboard/steps/${id}`)"
          @edit="onEditStep"
          @delete="openConfirm"
        />
      </template>
      <!-- Onglet fantôme pour l'édition -->
      <template v-else-if="selectedTab === 'update-step'">
        <UpdateStepForm v-if="editingStep" :step="editingStep" @navigate="onNavigate" />
      </template>
      <!-- zone modale de confirmation -->
      <div v-if="confirmVisible" class="confirm-backdrop" @click="cancelDelete"></div>
      <div v-if="confirmVisible" class="confirm-modal">
        <p>Are you sure you want to delete this step ?</p>
        <div class="confirm-actions">
          <button class="btn-yes" @click="proceedDeleteStep">Yes</button>
          <button class="btn-no" @click="cancelDelete">No</button>
        </div>
      </div>

      <!-- ***************** CONTENUS ***************** -->
      <template v-if="selectedTab === 'create-content'">
        <CreateContentForm />
      </template>
      <template v-else-if="selectedTab === 'list-contents'">
        <h2>Your contents</h2>
        <SearchBar placeholder="Search for your roadmaps" v-model="searchText" />

        <UserContentCard
          v-for="rm in filteredContents"
          :key="rm.id"
          :content="rm"
          :showStats="true"
          :showEdit="true"
          :showDelete="true"
          @stats="(id) => router.push(`/dashboard/contents/${id}`)"
          @edit="onEditContent"
          @delete="openConfirm"
        />
      </template>
      <!-- Onglet fantôme pour l'édition -->
      <template v-else-if="selectedTab === 'update-content'">
        <UpdateContentForm v-if="editingContent" :content="editingContent" @navigate="onNavigate" />
      </template>
      <!-- zone modale de confirmation -->
      <div v-if="confirmVisible" class="confirm-backdrop" @click="cancelDelete"></div>
      <div v-if="confirmVisible" class="confirm-modal">
        <p>Are you sure you want to delete this content ?</p>
        <div class="confirm-actions">
          <button class="btn-yes" @click="proceedDeleteContent">Yes</button>
          <button class="btn-no" @click="cancelDelete">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ContentBuilderMenu from '@/components/ui/ContentBuilderMenu.vue'
import CreateRoadmapForm from '@/components/ui/CreateRoadmapForm.vue'
import UserRoadmapCard from '@/components/ui/UserRoadmapCard.vue'
import CreateContentForm from '@/components/ui/CreateContentForm.vue'
import CreateStepForm from '@/components/ui/CreateStepForm.vue'
import UserContentCard from '@/components/ui/UserContentCard.vue'
import UserStepCard from '@/components/ui/UserStepCard.vue'
import UpdateContentForm from '@/components/ui/UpdateContentForm.vue'
import UpdateRoadmapForm from '@/components/ui/UpdateRoadmapForm.vue'
import UpdateStepForm from '@/components/ui/UpdateStepForm.vue'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/ui/SearchBar.vue'
import type { Content, Step, Roadmap } from '@/types/collections'

const selectedTab = ref('create-roadmap')
// nouvel état pour l’édition
const editingContent = ref<Content | null>(null)
const editingStep = ref<Step | null>(null)
const editingRoadmap = ref<Roadmap | null>(null)
const router = useRouter()
const userStore = useUserStore()

const searchText = ref('')

// ID de contenu en attente de suppression
const pendingDeleteId = ref<string | null>(null)
// Contrôle l’affichage du modal
const confirmVisible = ref(false)

// Ouvre la pop-up de confirmation
function openConfirm(id: string) {
  pendingDeleteId.value = id
  confirmVisible.value = true
}

// Annule la suppression
function cancelDelete() {
  pendingDeleteId.value = null
  confirmVisible.value = false
}

// Suppression roadmap
async function proceedDeleteRoadmap() {
  if (pendingDeleteId.value) {
    await userStore.deleteRoadmap(pendingDeleteId.value)
  }
  cancelDelete()
}

// Suppression étape
async function proceedDeleteStep() {
  if (pendingDeleteId.value) {
    await userStore.deleteStep(pendingDeleteId.value)
  }
  cancelDelete()
}

// Suppression contenu
async function proceedDeleteContent() {
  if (pendingDeleteId.value) {
    await userStore.deleteContent(pendingDeleteId.value)
  }
  cancelDelete()
}

const filteredRoadmaps = computed(() => {
  const listOfRoadmaps = userStore.roadmapsCreated || []
  if (!searchText.value.trim()) return listOfRoadmaps
  return listOfRoadmaps.filter((rm) =>
    rm.title.toLowerCase().includes(searchText.value.toLowerCase()),
  )
})

const filteredSteps = computed(() => {
  const listOfSteps = userStore.stepsCreated || []
  if (!searchText.value.trim()) return listOfSteps
  return listOfSteps.filter((rm) => rm.title.toLowerCase().includes(searchText.value.toLowerCase()))
})

const filteredContents = computed(() => {
  const listOfContents = userStore.contentsCreated || []
  if (!searchText.value.trim()) return listOfContents
  return listOfContents.filter((rm) =>
    rm.title.toLowerCase().includes(searchText.value.toLowerCase()),
  )
})

function onNavigate(tab: string) {
  selectedTab.value = tab
}

// appelé par le <UserRoadmapCard @edit>
function onEditRoadmap(id: string) {
  const c = userStore.roadmapsCreated.find((c) => c.id === id)
  if (c) {
    editingRoadmap.value = c
    selectedTab.value = 'update-roadmap'
  }
}

// appelé par le <UserStepCard @edit>
function onEditStep(id: string) {
  const s = userStore.stepsCreated.find((s) => s.id === id)
  if (s) {
    editingStep.value = s
    selectedTab.value = 'update-step'
  }
}

// appelé par le <UserContentCard @edit>
function onEditContent(id: string) {
  const c = userStore.contentsCreated.find((c) => c.id === id)
  if (c) {
    editingContent.value = c
    selectedTab.value = 'update-content'
  }
}

onMounted(async () => {
  await userStore.fetchProfile()
})
</script>

<style scoped>
.builder-page {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  background: var(--color-dark-charcoal);
  max-width: 1200px;
  margin: 0 auto;
}
.builder-content {
  /* flex: 1; */
  width: 100%;
  background: var(--color-dark-gray);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

h2 {
  color: var(--color-cream);
  font-weight: bold;
  font-family: var(--font-primary);
}

.status {
  color: var(--color-light-gray);
  text-align: center;
  margin-top: var(--spacing-lg);
}

.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
}
.confirm-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-charcoal);
  color: var(--color-cream);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  z-index: 201;
  width: 90%;
  max-width: 320px;
  text-align: center;
}
.confirm-actions {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: space-around;
}
.confirm-actions .btn-yes,
.confirm-actions .btn-no {
  padding: var(--spacing-xs) var(--spacing-md);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: bold;
}
.confirm-actions .btn-yes {
  background: var(--color-gold);
  color: var(--color-black);
}
.confirm-actions .btn-no {
  background: var(--color-darker-charcoal);
  color: var(--color-cream);
  border: 1px solid var(--color-medium-gray);
}
.confirm-actions .btn-yes:hover,
.confirm-actions .btn-no:hover {
  opacity: 0.8;
}
</style>
