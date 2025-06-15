<!-- src/components/ui/RoadmapCard.vue -->

<template>
  <div class="roadmap-card">
    <div class="roadmap-text">
      <!-- add gamepad icon -->
      <h2 class="roadmap-title">
        <i class="pi pi-sitemap"></i>
        {{ title }}
      </h2>
      <p class="roadmap-subtitle">{{ subTitle }}</p>
      <p class="roadmap-steps">
        <i class="pi pi-list"></i>
        {{ stepsCount }} steps
      </p>
      <!-- Ajouter l'auteur de la roadmap -->
      <p class="roadmap-author">
        <i class="pi pi-user"></i>
        {{ author?.username || 'Loading...' }}
      </p>
    </div>

    <div class="roadmap-actions">
      <!-- Bookmark button - visible only if user is connected -->
      <button
        v-if="userStore.profile"
        @click="toggleBookmark"
        class="bookmark-button"
        :class="{ bookmarked: isBookmarked, loading: bookmarkLoading }"
        :disabled="bookmarkLoading"
        :title="isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'"
      >
        <i
          :class="
            bookmarkLoading
              ? 'pi pi-spin pi-spinner'
              : isBookmarked
                ? 'pi pi-bookmark-fill'
                : 'pi pi-bookmark'
          "
        ></i>
      </button>

      <!-- Start button -->
      <NavButton :to="`/roadmap/${id}`">Start</NavButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import NavButton from './NavButton.vue'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'
import type { User } from '@/types/collections'

const props = defineProps<{
  id: string
  title: string
  subTitle: string
  stepsCount: number
  isBookmarked?: boolean
  author?: User
}>()

const userStore = useUserStore()
const bookmarkLoading = ref(false)
const toast = useToast()

// Injection des fonctions depuis le parent
const updateBookmark = inject<(roadmapId: string, isBookmarked: boolean) => void>('updateBookmark')

// Utiliser une ref au lieu d'une computed pour pouvoir la modifier
const isBookmarked = ref(!!props.isBookmarked)

// Watcher pour synchroniser avec la prop parent quand elle change
watch(
  () => props.isBookmarked,
  (newValue) => {
    isBookmarked.value = !!newValue
  },
  { immediate: true },
)

const toggleBookmark = async () => {
  if (!userStore.profile || bookmarkLoading.value) return

  bookmarkLoading.value = true

  try {
    // Déterminer la méthode HTTP selon l'état actuel du bookmark
    const method = isBookmarked.value ? 'DELETE' : 'PUT'

    let requestBody = {}
    const url = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/user/bookmarks`

    // Pour DELETE, certaines APIs attendent le roadmapId dans le body
    // Pour PUT, on envoie toujours le roadmapId dans le body
    if (method === 'DELETE') {
      // Envoyer le roadmapId dans le body pour identifier quel bookmark supprimer
      requestBody = { roadmapId: props.id }
    } else {
      // Pour PUT (ajout), envoyer le roadmapId
      requestBody = { roadmapId: props.id }
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (response.ok) {
      // Inverser l'état local immédiatement pour un feedback visuel rapide
      const newState = !isBookmarked.value
      isBookmarked.value = newState

      // Mettre à jour le state parent pour synchroniser avec les autres composants
      if (updateBookmark) {
        updateBookmark(props.id, newState)
      }
      toast.success(newState ? 'Save in bookmarks' : 'Removed from bookmarks')
    } else {
      const errorText = await response.text()
      console.error(
        `Erreur lors du ${method === 'DELETE' ? 'retrait' : 'ajout'} du bookmark:`,
        errorText,
      )
      toast.error('Error. Please retry.')
    }
  } catch (error) {
    console.error('Erreur lors de la modification du bookmark:', error)
    toast.error('Server error.')
  } finally {
    bookmarkLoading.value = false
  }
}
</script>

<style scoped>
.roadmap-card {
  display: flex;
  height: 150px;
  width: 1000px;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, var(--color-charcoal), var(--color-darker-charcoal));
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.roadmap-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
}

.roadmap-text {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.roadmap-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  color: var(--color-gold);
  margin: 0;
  font-weight: bold;
}

.roadmap-title i {
  color: var(--color-gold);
}

.roadmap-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-light-gray);
}

.roadmap-steps {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-medium-gray);
}

.roadmap-steps i {
  color: var(--color-gold);
}

.roadmap-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.bookmark-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 2px solid var(--color-medium-gray);
  background: transparent;
  color: var(--color-medium-gray);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--font-size-lg);
}

.bookmark-button:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
  background: rgba(255, 215, 0, 0.1);
  transform: translateY(-2px);
}

.bookmark-button.bookmarked {
  border-color: var(--color-gold);
  color: var(--color-gold);
  background: rgba(255, 215, 0, 0.1);
}

.bookmark-button.bookmarked:hover {
  border-color: var(--color-light-yellow);
  color: var(--color-light-yellow);
  background: rgba(255, 215, 0, 0.2);
}

.bookmark-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.bookmark-button.loading {
  pointer-events: none;
}

.start-button {
  --border-radius: var(--radius-full);
  background: var(--color-gold);
  color: var(--color-charcoal) !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.start-button:hover {
  background: var(--color-light-yellow);
  transform: translateY(-2px);
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

/* Responsive - ajuster sur mobile */
@media (max-width: 768px) {
  .roadmap-author {
    font-size: var(--font-size-xs);
  }
}

/* Responsive : stacking on smaller screens */
@media (max-width: 768px) {
  .roadmap-card {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
    width: 100%;
    height: auto;
  }

  .roadmap-actions {
    width: 100%;
    justify-content: space-between;
  }

  .bookmark-button {
    width: 44px;
    height: 44px;
  }

  .start-button {
    flex: 1;
    margin-left: var(--spacing-md);
  }
}

@media (max-width: 576px) {
  .roadmap-actions {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .start-button {
    width: 100%;
    margin-left: 0;
    justify-content: center;
  }

  .bookmark-button {
    align-self: flex-end;
  }
}
</style>
