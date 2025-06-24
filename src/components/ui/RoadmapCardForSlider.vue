<!-- src/components/ui/RoadmapCardForSlider.vue -->

<template>
  <div
    class="roadmap-card"
    :class="{
      'roadmap-card--active': isActive,
      'roadmap-card--loading': imageLoading,
    }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Container de l'image avec overlay -->
    <div class="roadmap-cover-container">
      <!-- Image de couverture -->
      <img
        :src="roadmap.cover"
        :alt="roadmap.title"
        class="roadmap-cover"
        @load="handleImageLoad"
        @error="handleImageError"
      />

      <!-- Overlay d'informations au hover -->
      <div class="roadmap-overlay">
        <div class="overlay-content">
          <!-- Statistiques de vues -->
          <div class="roadmap-stats">
            <!-- <div class="stat-item">
              <i class="pi pi-eye"></i>
              <span>{{ formatViews(roadmap.totalViews) }}</span>
            </div> -->
            <div class="stat-item">
              <i class="pi pi-calendar"></i>
              <span>{{ formatDate(roadmap.createdAt) }}</span>
            </div>
          </div>

          <!-- Bouton d'action -->
          <NavButton :icon="'pi-play-circle'" :icon-position="'left'" :to="`/roadmap/${roadmap.id}`"
            >Explore</NavButton
          >
        </div>
      </div>

      <!-- Badge tendance si beaucoup de vues -->
      <div v-if="isTrending" class="trending-badge">
        <i class="pi pi-bolt"></i>
        <span>Trending</span>
      </div>

      <!-- Loader d'image -->
      <div v-if="imageLoading" class="image-loader">
        <i class="pi pi-spinner"></i>
      </div>

      <!-- Fallback si erreur d'image -->
      <div v-if="imageError" class="image-fallback">
        <i class="pi pi-image"></i>
        <span>No image</span>
      </div>
    </div>

    <!-- Contenu textuel -->
    <div class="roadmap-content">
      <!-- Titre du jeu -->
      <h3 class="roadmap-title" :title="roadmap.title">
        {{ roadmap.title }}
      </h3>

      <!-- Sous-titre si disponible -->
      <p v-if="roadmap.subTitle" class="roadmap-subtitle" :title="roadmap.subTitle">
        {{ roadmap.subTitle }}
      </p>

      <!-- Informations complémentaires -->
      <div class="roadmap-info">
        <!-- Compteur de roadmaps -->
        <span class="roadmap-count">
          <i class="pi pi-sitemap"></i>
          {{ stepsCount }} step{{ stepsCount > 1 ? 's' : '' }}
        </span>

        <span class="owner">
          <i class="pi pi-user"></i>
          {{ author?.username || 'Loading...' }}
        </span>

        <!-- Indicateur premium si applicable -->
        <!-- <span v-if="hasPremiumContent" class="premium-badge">
          <i class="pi pi-star"></i>
          Premium
        </span> -->
      </div>

      <!-- Barre de progression des vues (effet visuel) -->
      <div class="popularity-bar">
        <div class="popularity-fill" :style="{ width: popularityPercentage + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue'
import type { Roadmap, User } from '@/types/collections'
import NavButton from './NavButton.vue'

const props = defineProps<{ roadmap: Roadmap; author?: User; isActive?: boolean }>()

defineEmits<{
  click: [roadmap: Roadmap]
}>()

const imageLoading = ref(true)
const imageError = ref(false)
const isHovered = ref(false)

const stepsCount = computed(() => (props.roadmap.Steps ?? []).length)

const isTrending = computed(() => {
  return props.roadmap.viewsPerMonth > 1000
})

// const hasPremiumContent = computed(() => {
//   return stepsCount.value > 5
// })

const popularityPercentage = computed(() => {
  const maxViews = 10000
  return Math.min((props.roadmap.totalViews / maxViews) * 100, 100)
})

// Utilitaires de formatage
// const formatViews = (views: number): string => {
//   if (views >= 1000000) {
//     return (views / 1000000).toFixed(1) + 'M'
//   } else if (views >= 1000) {
//     return (views / 1000).toFixed(1) + 'K'
//   }
//   return views.toString()
// }

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Gestionnaires d'événements
const handleImageLoad = () => {
  imageLoading.value = false
  imageError.value = false
}

const handleImageError = () => {
  imageLoading.value = false
  imageError.value = true
}

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
}
</script>

<style scoped>
.roadmap-card {
  display: flex;
  flex-direction: column;
  background: var(--color-charcoal);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  height: 100%;
  min-height: 320px;
}

.roadmap-card:hover {
  transform: translateY(-5px) scale(1.02);
  border-color: var(--color-gold);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 215, 0, 0.2);
}

.roadmap-card--active {
  border-color: var(--color-gold);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
}

.roadmap-card--loading {
  pointer-events: none;
}

/* Container de l'image */
.roadmap-cover-container {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: var(--color-darker-charcoal);
}

.roadmap-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.roadmap-card:hover .roadmap-cover {
  transform: scale(1.1);
}

/* Overlay d'informations */
.roadmap-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--spacing-md);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.roadmap-card:hover .roadmap-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

/* Statistiques */
.roadmap-stats {
  display: flex;
  gap: var(--spacing-md);
  align-self: flex-start;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: rgba(0, 0, 0, 0.6);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--color-cream);
  font-size: var(--font-size-xs);
  font-weight: 500;
  backdrop-filter: blur(4px);
}

.stat-item i {
  color: var(--color-gold);
}

/* Bouton d'action */
.play-btn {
  align-self: center;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-gold);
  color: var(--color-charcoal);
  border: none;
  border-radius: var(--radius-full);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-family: var(--font-secondary);
  font-weight: 600;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateY(10px);
  opacity: 0;
}

.roadmap-card:hover .play-btn {
  transform: translateY(0);
  opacity: 1;
}

.play-btn:hover {
  background: var(--color-light-yellow);
  transform: scale(1.05);
}

/* Badge trending */
.trending-badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: linear-gradient(135deg, var(--color-orange), #ff6b6b);
  color: var(--color-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Loader et fallback d'image */
.image-loader,
.image-fallback {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-medium-gray);
  font-size: var(--font-size-sm);
  gap: var(--spacing-sm);
}

.image-loader i {
  font-size: var(--font-size-xl);
  animation: spin 1s linear infinite;
}

.image-fallback {
  background: var(--color-darker-charcoal);
}

.image-fallback i {
  font-size: var(--font-size-2xl);
  color: var(--color-light-gray);
}

/* Contenu textuel */
.roadmap-content {
  padding: var(--spacing-md);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.roadmap-title {
  font-family: var(--font-primary);
  color: var(--color-cream);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
  /* Ellipsis pour texte long */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.roadmap-subtitle {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
  margin: 0;
  line-height: 1.4;
  /* Limitation à 2 lignes */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.roadmap-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  gap: var(--spacing-sm);
}

.roadmap-count {
  color: var(--color-gold);
  font-size: var(--font-size-sm);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.premium-badge {
  background: linear-gradient(135deg, var(--color-gold), var(--color-light-yellow));
  color: var(--color-charcoal);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

/* Barre de popularité */
.popularity-bar {
  width: 100%;
  height: 3px;
  background: var(--color-darker-charcoal);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: var(--spacing-sm);
}

.popularity-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-gold), var(--color-orange));
  border-radius: var(--radius-full);
  transition: width 1s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .roadmap-card {
    min-height: 280px;
  }

  .roadmap-cover-container {
    height: 150px;
  }

  .roadmap-content {
    padding: var(--spacing-sm);
  }

  .roadmap-title {
    font-size: var(--font-size-base);
  }

  .roadmap-subtitle {
    font-size: var(--font-size-xs);
  }

  .roadmap-stats {
    gap: var(--spacing-sm);
  }

  .stat-item {
    padding: 2px var(--spacing-xs);
    font-size: 10px;
  }

  .play-btn {
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 480px) {
  .roadmap-card {
    min-height: 260px;
  }

  .roadmap-cover-container {
    height: 130px;
  }

  .roadmap-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .trending-badge {
    font-size: 10px;
    padding: 2px var(--spacing-xs);
  }
}

/* Animation d'entrée */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.roadmap-card {
  animation: fadeInUp 0.5s ease-out;
}

.pi-user {
  color: var(--color-gold);
}

.owner {
  color: var(--color-medium-gray);
  font-size: var(--font-size-sm);
  margin-top: 0.25rem;
  text-align: start;
}
</style>
