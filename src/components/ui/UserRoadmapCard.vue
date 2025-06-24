<!-- src/components/ui/UserRoadmapCard.vue -->

<template>
  <div class="user-roadmap-card">
    <div class="cover-wrapper">
      <img :src="roadmap.cover" :alt="roadmap.title" class="cover" />
    </div>
    <div class="info">
      <h3 class="title">{{ roadmap.title }}</h3>
      <p class="subTitle">{{ roadmap.subTitle }}</p>
      <p class="description">{{ roadmap.description }}</p>
      <div class="meta">
        <span>
          <i class="pi pi-list"></i>
          {{ (roadmap.Steps ?? []).length }} steps
        </span>
        <span v-if="props.showPublished">
          <i class="pi pi-check-circle"></i>
          {{ roadmap.published ? 'Published' : 'Draft' }}
        </span>
        <!-- <span v-if="props.showPremium">
          <i class="pi pi-star"></i>
          {{ roadmap.premium ? 'Premium' : 'Free' }}
        </span> -->
        <!-- Afficher l'auteur uniquement si showAuthor est true -->
        <span v-if="props.showAuthor" class="roadmap-author">
          <i class="pi pi-user"></i>
          {{ author?.username || 'Loading...' }}
        </span>
      </div>
    </div>
    <div class="actions">
      <Button
        v-if="userStore.profile"
        :icon="
          bookmarkLoading
            ? 'pi pi-spin pi-spinner'
            : isBookmarked
              ? 'pi pi-bookmark-fill'
              : 'pi pi-bookmark'
        "
        class="p-button-text bookmark-action"
        :class="{ bookmarked: isBookmarked, loading: bookmarkLoading }"
        :disabled="bookmarkLoading"
        :title="isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'"
        @click="toggleBookmark"
      />
      <Button
        v-if="showView"
        icon="pi pi-eye"
        class="p-button-text"
        title="Show"
        @click="$emit('view', roadmap.id)"
      />
      <Button
        v-if="showStats"
        icon="pi pi-chart-bar"
        class="p-button-text"
        title="Analytics"
        @click="$emit('stats', roadmap.id)"
      />
      <Button
        v-if="showEdit"
        icon="pi pi-pencil"
        class="p-button-text"
        title="Edit"
        @click="$emit('edit', roadmap.id)"
      />
      <Button
        v-if="showDelete"
        icon="pi pi-trash"
        class="p-button-text p-button-danger"
        title="Delete"
        @click="$emit('delete', roadmap.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults, ref, computed, onMounted } from 'vue'
import type { Roadmap, User } from '@/types/collections'
import Button from 'primevue/button'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'

const props = withDefaults(
  defineProps<{
    roadmap: Roadmap
    author?: User
    showView?: boolean
    showStats?: boolean
    showEdit?: boolean
    showDelete?: boolean
    showPublished?: boolean
    showPremium?: boolean
    showAuthor?: boolean
  }>(),
  {
    showPublished: true,
    showPremium: true,
    showAuthor: false,
  },
)

const emit = defineEmits<{
  (e: 'view', id: string): void
  (e: 'stats', id: string): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
  (e: 'bookmarkChanged', roadmapId: string, isBookmarked: boolean): void
}>()

const userStore = useUserStore()
const toast = useToast()
const bookmarkLoading = ref(false)

// Vérifier si la roadmap est dans les bookmarks
const isBookmarked = computed(() => {
  if (!userStore.bookmarks) return false
  return userStore.bookmarks.some((bookmark) => bookmark.id === props.roadmap.id)
})

// Fonction pour gérer le toggle des bookmarks
const toggleBookmark = async () => {
  if (!userStore.profile || bookmarkLoading.value) return

  bookmarkLoading.value = true

  try {
    // Utiliser l'action du store qui gère l'API et la synchronisation
    const result = await userStore.toggleBookmark(props.roadmap)

    if (result.success) {
      const bookmarkStatus = result.isBookmarked !== undefined ? result.isBookmarked : false
      emit('bookmarkChanged', props.roadmap.id, bookmarkStatus)

      // Afficher le message de succès
      toast.success(result.action === 'added' ? 'Save in bookmarks' : 'Removed from bookmarks')
    } else {
      console.error('Erreur lors du toggle bookmark:', result.error)
      toast.error('Error. Please retry.')
    }
  } catch (error) {
    console.error('Erreur lors de la modification du bookmark:', error)
    toast.error('Server error.')
  } finally {
    bookmarkLoading.value = false
  }
}

// Charger les bookmarks au montage du composant si nécessaire
onMounted(async () => {
  if (userStore.profile && !userStore.bookmarks) {
    await userStore.fetchUserBookmarks()
  }
})
</script>

<style scoped>
.user-roadmap-card {
  display: flex;
  align-items: stretch;
  background: var(--color-charcoal);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  margin-bottom: var(--spacing-lg);
  cursor: pointer;
  max-height: 200px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.user-roadmap-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
}

/* .cover-wrapper {
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  padding-left: var(--spacing-md);
} */
.cover {
  width: 200px;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-lg);
  /* padding-left: var(--spacing-md); */
}

.info {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  display: grid;
  grid-template-areas:
    'title title'
    'subTitle subTitle'
    'description description'
    'meta meta';
  grid-row-gap: var(--spacing-sm);
}

.title {
  grid-area: title;
  font-size: var(--font-size-2xl);
  color: var(--color-cream);
  font-family: var(--font-primary);
  margin: 0;
}

.subTitle {
  grid-area: subTitle;
  font-size: var(--font-size-base);
  color: var(--color-light-gray);
  background: var(--color-darker-charcoal);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.description {
  grid-area: description;
  font-size: var(--font-size-sm);
  color: var(--color-medium-gray);
  margin: 0;
  word-break: break-all;
  /* Limiter le texte à 3 lignes maximum et ajouter “...” */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  grid-area: meta;
  display: flex;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-sm);
}

.meta span {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-light-gray);
}

.meta i {
  color: var(--color-gold);
  font-size: var(--font-size-base);
}

.roadmap-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-medium-gray);
  margin-top: var(--spacing-xs);
}

.roadmap-author i {
  color: var(--color-gold);
}

.actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: var(--spacing-md);
  gap: var(--spacing-md);
}

.actions ::v-deep(.p-button-text) {
  background: var(--color-darker-charcoal);
  border: none;
  color: var(--color-cream);
  transition:
    background-color 0.2s ease,
    opacity 0.2s ease;
}

.actions ::v-deep(.p-button-text:hover) {
  background: var(--color-dark-gray) !important;
  opacity: 0.8;
  color: var(--color-gold) !important;
}

.actions ::v-deep(.p-button-danger) {
  color: var(--color-cream) !important;
}

.actions ::v-deep(.p-button-danger:hover) {
  background: var(--color-light-yellow) !important;
  color: var(--color-charcoal) !important;
}

.actions ::v-deep(.bookmark-action) {
  background: var(--color-darker-charcoal);
  border: 2px solid var(--color-medium-gray);
  color: var(--color-medium-gray);
  transition: all 0.2s ease;
}

.actions ::v-deep(.bookmark-action:hover) {
  background: rgba(255, 215, 0, 0.1) !important;
  border-color: var(--color-gold) !important;
  color: var(--color-gold) !important;
}

.actions ::v-deep(.bookmark-action.bookmarked) {
  background: rgba(255, 215, 0, 0.1) !important;
  border-color: var(--color-gold) !important;
  color: var(--color-gold) !important;
}

.actions ::v-deep(.bookmark-action.bookmarked:hover) {
  background: rgba(255, 215, 0, 0.2) !important;
  border-color: var(--color-light-yellow) !important;
  color: var(--color-light-yellow) !important;
}

.actions ::v-deep(.bookmark-action:disabled) {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

.actions ::v-deep(.bookmark-action.loading) {
  pointer-events: none !important;
}

/* === Responsive mobile (<768px) === */
@media (max-width: 768px) {
  .user-roadmap-card {
    flex-direction: column;
    max-height: none;
  }
  .cover {
    width: 100%;
    height: auto;
    object-fit: cover;
    padding-left: 0;
    border-radius: var(--radius-md) var(--radius-md) 0 0;
  }
  .info {
    padding: var(--spacing-md);
    grid-template-areas:
      'title'
      'subTitle'
      'description'
      'meta';
  }
  .title {
    font-size: var(--font-size-xl);
  }
  .subTitle {
    font-size: var(--font-size-sm);
  }
  .description {
    -webkit-line-clamp: 4; /* un peu plus de texte visible */
  }
  .meta {
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
  .actions {
    flex-direction: row;
    justify-content: flex-start;
    padding: var(--spacing-sm) var(--spacing-md);
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .actions ::v-deep(.p-button-text) {
    flex: 1;
    margin: 0 var(--spacing-xs);
    max-width: 40px;
  }

  /* S'assurer que le bookmark reste visible même avec beaucoup d'actions */
  .actions ::v-deep(.bookmark-action) {
    order: -1; /* Placer le bookmark en premier */
    flex: 0 0 auto;
    min-width: 44px;
  }
}
</style>
