<!-- src/components/ui/RoadmapsSlider.vue -->

<template>
  <div class="roadmaps-slider-container">
    <!-- Header avec titre et navigation -->
    <div class="slider-header">
      <h2 class="slider-title">Roadmaps</h2>
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="state.loading" class="loading-container">
      <i class="pi pi-spinner loading-spinner"></i>
      <span>Loading roadmaps...</span>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="state.error" class="error-container">
      <i class="pi pi-exclamation-triangle"></i>
      <span>{{ state.error }}</span>
      <button @click="retryLoading" class="retry-btn">
        <i class="pi pi-refresh"></i>
        Retry
      </button>
    </div>

    <!-- Carrousel des jeux -->
    <div v-else-if="state.roadmaps.length > 0" class="carousel-wrapper">
      <Carousel
        ref="carousel"
        v-model="currentSlide"
        :itemsToShow="responsiveItemsToShow"
        :wrapAround="true"
        :autoplay="0"
        :transition="600"
        :mouseDrag="true"
        :touchDrag="true"
        :snapAlign="'start'"
      >
        <Slide v-for="(roadmap, index) in state.roadmaps" :key="roadmap.id">
          <div class="slide-content">
            <RoadmapCardForSlider
              :roadmap="roadmap"
              :isActive="index === currentSlide"
              @click="handleRoadmapClick(roadmap)"
              :author="state.authors.get(roadmap.CreatedBy)"
            />
          </div>
        </Slide>
      </Carousel>
    </div>

    <!-- Message si aucun jeu -->
    <div v-else class="empty-state">
      <i class="pi pi-gamepad2"></i>
      <span>No roadmaps available</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, onUnmounted } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import RoadmapCardForSlider from './RoadmapCardForSlider.vue'
import type { Roadmap, User } from '@/types/collections'
import { useRouter } from 'vue-router'

const state = reactive({
  roadmaps: [] as Roadmap[],
  authors: new Map<string, User>(),
  loading: true,
  error: '',
})
const router = useRouter()
const carousel = ref<InstanceType<typeof Carousel> | null>(null)
const currentSlide = ref(0)
const responsiveItemsToShow = ref(3)

const updateResponsiveSettings = () => {
  const width = window.innerWidth
  if (width < 480) {
    responsiveItemsToShow.value = 1
  } else if (width < 768) {
    responsiveItemsToShow.value = 2
  } else if (width < 1024) {
    responsiveItemsToShow.value = 2
  } else {
    responsiveItemsToShow.value = 3
  }
}

const handleRoadmapClick = (roadmap: Roadmap) => {
  const id = roadmap.id
  router.push(`/roadmap/${id}`)
}

const loadRoadmaps = async () => {
  state.loading = true
  state.error = ''

  try {
    // Récupérer les roadmaps
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmaps`,
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    state.roadmaps = await res.json()

    // Récupérer les auteurs uniques
    const authorIds = [...new Set(state.roadmaps.map((rm) => rm.CreatedBy))]

    // Faire les appels API pour chaque auteur
    const authorPromises = authorIds.map(async (authorId) => {
      try {
        const userRes = await fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/user/${authorId}`,
        )
        if (userRes.ok) {
          const user = await userRes.json()
          state.authors.set(authorId, user)
        }
      } catch (err) {
        console.error(`Erreur lors du chargement de l'utilisateur ${authorId}:`, err)
        // En cas d'erreur, on peut créer un utilisateur par défaut
        state.authors.set(authorId, {
          id: authorId,
          username: 'Unknown User',
          email: '',
          password: '',
          type: 'user',
          profilePicture: '',
          createdAt: '',
          updatedAt: '',
          lastLogin: '',
          Bookmarks: [],
          RoadmapsStarted: [],
          RoadmapsCreated: [],
          StepsCreated: [],
          ContentsCreated: [],
          Comments: [],
        })
      }
    })

    // Attendre que tous les auteurs soient chargés
    await Promise.all(authorPromises)
  } catch (err) {
    state.error = 'Erreur lors du chargement des roadmaps'
    console.error('Error loading roadmaps:', err)
  } finally {
    state.loading = false
  }
}

const retryLoading = () => {
  loadRoadmaps()
}

onMounted(() => {
  loadRoadmaps()
  updateResponsiveSettings()
  window.addEventListener('resize', updateResponsiveSettings)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateResponsiveSettings)
})
</script>

<style scoped>
.roadmaps-slider-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

/* Header du slider */
.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.slider-title {
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  font-weight: bold;
  color: var(--color-cream);
  margin: 0;
}

.slider-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-gold);
  background: transparent;
  color: var(--color-gold);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: var(--font-size-base);
}

.control-btn:hover:not(:disabled) {
  background: var(--color-gold);
  color: var(--color-charcoal);
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* États de chargement et erreur */
.loading-container,
.error-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
}

.loading-spinner {
  font-size: var(--font-size-2xl);
  color: var(--color-gold);
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.error-container i,
.empty-state i {
  font-size: var(--font-size-3xl);
  color: var(--color-orange);
  margin-bottom: var(--spacing-md);
}

.retry-btn {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-gold);
  color: var(--color-charcoal);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-secondary);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: var(--color-light-yellow);
  transform: translateY(-2px);
}

/* Wrapper du carrousel */
.carousel-wrapper {
  position: relative;
}

.slide-content {
  padding: 0 var(--spacing-sm);
}

/* Pagination personnalisée */
.carousel-pagination {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.pagination-dot {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  border: none;
  background: var(--color-medium-gray);
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-dot--active,
.pagination-dot:hover {
  background: var(--color-gold);
  transform: scale(1.2);
}

/* Contrôle autoplay */
.autoplay-control {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-lg);
}

.autoplay-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-darker-charcoal);
  color: var(--color-cream);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: all 0.3s ease;
}

.autoplay-btn:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

/* Responsive */
@media (max-width: 768px) {
  .roadmaps-slider-container {
    padding: var(--spacing-md);
  }

  .slider-header {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .slider-title {
    font-size: var(--font-size-xl);
  }

  .control-btn {
    width: 36px;
    height: 36px;
    font-size: var(--font-size-sm);
  }

  .slide-content {
    padding: 0 var(--spacing-xs);
  }
}

@media (max-width: 480px) {
  .roadmaps-slider-container {
    padding: var(--spacing-sm);
  }

  .slider-title {
    font-size: var(--font-size-lg);
  }

  .slider-controls {
    gap: var(--spacing-xs);
  }

  .control-btn {
    width: 32px;
    height: 32px;
  }

  .autoplay-control {
    margin-top: var(--spacing-md);
  }

  .autoplay-btn {
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}

/* Surcharge des styles du carrousel */
:deep(.carousel__track) {
  padding: var(--spacing-sm) 0;
}

:deep(.carousel__slide) {
  padding: 0;
}

:deep(.carousel__viewport) {
  perspective: 1000px;
}
</style>
