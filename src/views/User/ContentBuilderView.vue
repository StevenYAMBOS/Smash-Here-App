<!-- src/views/User/ContentBuilderView.vue -->

<template>
  <div class="builder-page">
    <ContentBuilderMenu
      v-model:selected="selectedTab"
      @navigate="onNavigate"
      class="builder-menu"
    />

    <div class="builder-content">
      <div class="builder-header">
        <h2>
          <i class="pi pi-cog"></i>
          {{ tabLabels[selectedTab] }}
        </h2>
        <SearchBar
          v-if="['list-roadmaps', 'list-steps', 'list-contents'].includes(selectedTab)"
          placeholder="Search…"
          v-model="searchText"
          class="builder-search"
        />
      </div>

      <!-- ***************** ROADMAPS ***************** -->
      <template v-if="selectedTab === 'create-roadmap'">
        <CreateRoadmapForm />
      </template>
      <template v-else-if="selectedTab === 'list-roadmaps'">
        <div class="cards-grid">
          <UserRoadmapCard
            v-for="rm in filteredRoadmaps"
            :key="rm.id"
            :roadmap="rm"
            :show-view="true"
            :showStats="false"
            :showEdit="true"
            :showDelete="true"
            @view="(id) => router.push(`/roadmap/${id}`)"
            @stats="(id) => router.push(`/dashboard/roadmpas/${id}`)"
            @edit="onEditRoadmap"
            @delete="openConfirmRoadmap"
          />
        </div>
      </template>
      <template v-else-if="selectedTab === 'update-roadmap'">
        <UpdateRoadmapForm v-if="editingRoadmap" :roadmap="editingRoadmap" @navigate="onNavigate" />
      </template>

      <!-- ***************** ÉTAPES ***************** -->
      <template v-if="selectedTab === 'list-steps'">
        <div class="cards-grid">
          <UserStepCard
            v-for="st in filteredSteps"
            :key="st.id"
            :step="st"
            :showStats="false"
            :showEdit="true"
            :showDelete="true"
            @stats="(id) => router.push(`/dashboard/steps/${id}`)"
            @edit="onEditStep"
            @delete="openConfirmStep"
          />
        </div>
      </template>
      <template v-else-if="selectedTab === 'create-step'">
        <CreateStepForm />
      </template>
      <template v-else-if="selectedTab === 'update-step'">
        <UpdateStepForm v-if="editingStep" :step="editingStep" @navigate="onNavigate" />
      </template>

      <!-- ***************** CONTENUS ***************** -->
      <template v-if="selectedTab === 'list-contents'">
        <div class="cards-grid">
          <UserContentCard
            v-for="c in filteredContents"
            :key="c.id"
            :content="c"
            :showStats="false"
            :showEdit="true"
            :showDelete="true"
            @stats="(id) => router.push(`/dashboard/contents/${id}`)"
            @edit="onEditContent"
            @delete="openConfirmContent"
          />
        </div>
      </template>
      <template v-else-if="selectedTab === 'create-content'">
        <CreateContentForm />
      </template>
      <template v-else-if="selectedTab === 'update-content'">
        <UpdateContentForm v-if="editingContent" :content="editingContent" @navigate="onNavigate" />
      </template>

      <!-- confirmation modals -->
      <div
        v-if="confirmVisibleRoadmap"
        class="confirm-backdrop"
        @click="proceedDeleteRoadmap"
      ></div>
      <div v-if="confirmVisibleRoadmap" class="confirm-modal">
        <p>Are you sure you want to delete this roadmap ? This action cannot be reversed.</p>
        <div class="confirm-actions">
          <button class="btn-yes" @click="proceedDeleteRoadmap">Yes</button>
          <button class="btn-no" @click="cancelDeleteRoadmap">No</button>
        </div>
      </div>

      <div v-if="confirmVisibleStep" class="confirm-backdrop" @click="cancelDeleteStep"></div>
      <div v-if="confirmVisibleStep" class="confirm-modal">
        <p>Are you sure you want to delete this step ? This action cannot be reversed.</p>
        <div class="confirm-actions">
          <button class="btn-yes" @click="proceedDeleteStep">Yes</button>
          <button class="btn-no" @click="cancelDeleteStep">No</button>
        </div>
      </div>

      <div v-if="confirmVisibleContent" class="confirm-backdrop" @click="cancelDeleteContent"></div>
      <div v-if="confirmVisibleContent" class="confirm-modal">
        <p>Are you sure you want to delete this content ? This action cannot be reversed.</p>
        <div class="confirm-actions">
          <button class="btn-yes" @click="proceedDeleteContent">Yes</button>
          <button class="btn-no" @click="cancelDeleteContent">No</button>
        </div>
      </div>

      <!-- ***************** GUIDES ***************** -->
      <template v-if="selectedTab === 'list-guides'">
        <div class="cards-grid">
          <UserGuideCard
            v-for="g in filteredGuides"
            :key="g.id"
            :guide="g"
            :show-view="true"
            :showStats="false"
            :showEdit="true"
            :showDelete="true"
            @stats="(id) => router.push(`/dashboard/guides/${id}`)"
            @edit="onEditGuide"
            @delete="openConfirmGuide"
          />
        </div>
      </template>
      <template v-else-if="selectedTab === 'create-guide'">
        <CreateGuideForm />
      </template>
      <template v-else-if="selectedTab === 'update-guide'">
        <UpdateGuideForm v-if="editingGuide" :guide="editingGuide" @navigate="onNavigate" />
      </template>

      <!-- confirmation modals -->
      <div
        v-if="confirmVisibleRoadmap"
        class="confirm-backdrop"
        @click="proceedDeleteRoadmap"
      ></div>
      <div v-if="confirmVisibleRoadmap" class="confirm-modal">
        <p>Are you sure you want to delete this roadmap ? This action cannot be reversed.</p>
        <div class="confirm-actions">
          <button class="btn-yes" @click="proceedDeleteRoadmap">Yes</button>
          <button class="btn-no" @click="cancelDeleteRoadmap">No</button>
        </div>
      </div>

      <div v-if="confirmVisibleStep" class="confirm-backdrop" @click="cancelDeleteStep"></div>
      <div v-if="confirmVisibleStep" class="confirm-modal">
        <p>Are you sure you want to delete this step ? This action cannot be reversed.</p>
        <div class="confirm-actions">
          <button class="btn-yes" @click="proceedDeleteStep">Yes</button>
          <button class="btn-no" @click="cancelDeleteStep">No</button>
        </div>
      </div>

      <div v-if="confirmVisibleContent" class="confirm-backdrop" @click="cancelDeleteContent"></div>
      <div v-if="confirmVisibleContent" class="confirm-modal">
        <p>Are you sure you want to delete this content ? This action cannot be reversed.</p>
        <div class="confirm-actions">
          <button class="btn-yes" @click="proceedDeleteContent">Yes</button>
          <button class="btn-no" @click="cancelDeleteContent">No</button>
        </div>
      </div>

      <div v-if="confirmVisibleGuide" class="confirm-backdrop" @click="cancelDeleteGuide"></div>
      <div v-if="confirmVisibleGuide" class="confirm-modal">
        <p>Are you sure you want to delete this guide ? This action cannot be reversed.</p>
        <div class="confirm-actions">
          <button class="btn-yes" @click="proceedDeleteGuide">Yes</button>
          <button class="btn-no" @click="cancelDeleteGuide">No</button>
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
import type { Content, Step, Roadmap, Guide } from '@/types/collections'
import UserGuideCard from '@/components/ui/UserGuideCard.vue'
import CreateGuideForm from '@/components/ui/CreateGuideForm.vue'
import UpdateGuideForm from '@/components/ui/UpdateGuideForm.vue'

const selectedTab = ref('create-roadmap')
// nouvel état pour l’édition
const editingContent = ref<Content | null>(null)
const editingStep = ref<Step | null>(null)
const editingRoadmap = ref<Roadmap | null>(null)
const editingGuide = ref<Guide | null>(null)
const router = useRouter()
const userStore = useUserStore()

const searchText = ref('')

// Libellés pour le header
const tabLabels: Record<string, string> = {
  'create-roadmap': 'Create Roadmap',
  'list-roadmaps': 'Your Roadmaps',
  'update-roadmap': 'Edit Roadmap',
  'create-step': 'Create Step',
  'list-steps': 'Your Steps',
  'update-step': 'Edit Step',
  'create-content': 'Create Content',
  'list-contents': 'Your Contents',
  'update-content': 'Edit Content',
  'list-guides': 'Your Guides',
  'update-guide': 'Edit Guide',
}

// ID de contenu en attente de suppression
const pendingDeleteRoadmapId = ref<string | null>(null)
const pendingDeleteStepId = ref<string | null>(null)
const pendingDeleteContentId = ref<string | null>(null)
const pendingDeleteGuideId = ref<string | null>(null)
// Contrôle l’affichage du modal
const confirmVisibleRoadmap = ref(false)
const confirmVisibleStep = ref(false)
const confirmVisibleContent = ref(false)
const confirmVisibleGuide = ref(false)

// Ouvre la pop-up de confirmation (roadmaps)
function openConfirmRoadmap(id: string) {
  pendingDeleteRoadmapId.value = id
  confirmVisibleRoadmap.value = true
}

// Ouvre la pop-up de confirmation (étapes)
function openConfirmStep(id: string) {
  pendingDeleteStepId.value = id
  confirmVisibleStep.value = true
}

// Ouvre la pop-up de confirmation (contenus)
function openConfirmContent(id: string) {
  pendingDeleteContentId.value = id
  confirmVisibleContent.value = true
}

// Ouvre la pop-up de confirmation (guide)
function openConfirmGuide(id: string) {
  pendingDeleteGuideId.value = id
  confirmVisibleGuide.value = true
}

// Annule la suppression (roadmaps)
function cancelDeleteRoadmap() {
  pendingDeleteRoadmapId.value = null
  confirmVisibleRoadmap.value = false
}

// Annule la suppression (étapes)
function cancelDeleteStep() {
  pendingDeleteStepId.value = null
  confirmVisibleStep.value = false
}

// Annule la suppression (contenus)
function cancelDeleteContent() {
  pendingDeleteContentId.value = null
  confirmVisibleContent.value = false
}

// Annule la suppression (guide)
function cancelDeleteGuide() {
  pendingDeleteGuideId.value = null
  confirmVisibleGuide.value = false
}

// Suppression roadmap
async function proceedDeleteRoadmap() {
  if (pendingDeleteRoadmapId.value) {
    await userStore.deleteRoadmap(pendingDeleteRoadmapId.value)
  }
  cancelDeleteRoadmap()
}

// Suppression étape
async function proceedDeleteStep() {
  if (pendingDeleteStepId.value) {
    await userStore.deleteStep(pendingDeleteStepId.value)
  }
  cancelDeleteStep()
}

// Suppression contenu
async function proceedDeleteContent() {
  if (pendingDeleteContentId.value) {
    await userStore.deleteContent(pendingDeleteContentId.value)
  }
  cancelDeleteContent()
}

// Suppression guide
async function proceedDeleteGuide() {
  if (pendingDeleteGuideId.value) {
    await userStore.deleteGuide(pendingDeleteGuideId.value)
  }
  cancelDeleteGuide()
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

const filteredGuides = computed(() => {
  const listOfGuides = userStore.guidesCreated || []
  if (!searchText.value.trim()) return listOfGuides
  return listOfGuides.filter((guide) =>
    guide.title.toLowerCase().includes(searchText.value.toLowerCase()),
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

// appelé par le <UserContentCard @edit>
function onEditGuide(id: string) {
  const g = userStore.guidesCreated.find((g) => g.id === id)
  if (g) {
    editingGuide.value = g
    selectedTab.value = 'update-guide'
  }
}

onMounted(async () => {
  await userStore.fetchProfile()
})
</script>

<style scoped>
.builder-page {
  display: flex;
  background: var(--color-darker-charcoal);
    max-width: 1200px;
  margin: 0 auto;
  /* display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  background: var(--color-dark-charcoal);
  max-width: 1200px;
  margin: 0 auto; */
}

.builder-menu {
  width: 200px;
  background: var(--color-charcoal);
  border-right: 2px solid var(--color-gold);
}

.builder-content {
  flex: 1;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  /* flex: 1; */
  /* width: 100%;
  background: var(--color-dark-gray);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl); */
}

.builder-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.builder-header h2 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: var(--font-primary);
  color: var(--color-cream);
  font-size: var(--font-size-2xl);
}

/* h2 {
  color: var(--color-cream);
  font-weight: bold;
  font-family: var(--font-primary);
} */

.builder-search {
  width: 300px;
}

.cards-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin: auto 0;
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

@media (max-width: 768px) {
  .builder-page {
    flex-direction: column;
  }
  .builder-menu {
    width: 100%;
    border-right: none;
    border-bottom: 2px solid var(--color-gold);
  }
  .builder-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  .builder-search {
    width: 100%;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}
</style>
