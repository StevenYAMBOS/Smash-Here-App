<template>
  <header class="guide-header">
    <!-- Background avec effet dégradé -->
    <div class="header-background">
      <div class="background-overlay"></div>
      <img v-if="guide.cover" :src="guide.cover" :alt="guide.title" class="background-image" />
    </div>

    <!-- Contenu du header -->
    <div class="header-content">
      <!-- Badge de difficulté -->
      <div class="difficulty-badge" :class="`difficulty-${guide.difficulty}`">
        <i class="pi pi-bookmark badge-icon"></i>
        <span>{{ getDifficultyLabel(guide.difficulty) }}</span>
      </div>

      <!-- Titre principal -->
      <h1 class="guide-title">{{ guide.title }}</h1>

      <!-- Sous-titre -->
      <p v-if="guide.subTitle" class="guide-subtitle">{{ guide.subTitle }}</p>

      <!-- Description -->
      <p v-if="guide.description" class="guide-description">{{ guide.description }}</p>

      <!-- Métadonnées -->
      <div class="guide-meta">
        <div class="meta-item">
          <i class="pi pi-user meta-icon"></i>
          <span>{{ authorName }}</span>
        </div>

        <div class="meta-item">
          <i class="pi pi-calendar meta-icon"></i>
          <span>{{ formatDate(guide.createdAt) }}</span>
        </div>

        <div v-if="guide.estimatedReadTime" class="meta-item">
          <i class="pi pi-clock meta-icon"></i>
          <span>{{ guide.estimatedReadTime }} min read</span>
        </div>

        <div v-if="guide.language" class="meta-item">
          <i class="pi pi-globe meta-icon"></i>
          <span>{{ getLanguageLabel(guide.language) }}</span>
        </div>

        <div v-if="guide.version" class="meta-item">
          <i class="pi pi-tag meta-icon"></i>
          <span>v{{ guide.version }}</span>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="guide-stats">
        <div class="stat-item">
          <i class="pi pi-eye stat-icon"></i>
          <span>{{ formatNumber(guide.viewsCount || 0) }} views</span>
        </div>

        <div class="stat-item">
          <i class="pi pi-heart stat-icon"></i>
          <span>{{ formatNumber(guide.likesCount || 0) }} likes</span>
        </div>

        <div class="stat-item">
          <i class="pi pi-comment stat-icon"></i>
          <span>{{ formatNumber(guide.commentsCount || 0) }} comments</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="guide-actions">
        <button class="action-btn action-btn--primary" @click="likeGuide">
          <i class="pi pi-heart"></i>
          <span>Like</span>
        </button>

        <button class="action-btn action-btn--secondary" @click="bookmarkGuide">
          <i class="pi pi-bookmark"></i>
          <span>Bookmark</span>
        </button>

        <button class="action-btn action-btn--secondary" @click="shareGuide">
          <i class="pi pi-share-alt"></i>
          <span>Share</span>
        </button>
      </div>
    </div>

    <!-- Indicateur de scroll -->
    <div class="scroll-indicator" @click="scrollToContent">
      <i class="pi pi-angle-down scroll-icon"></i>
      <span class="scroll-text">Start Reading</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Guide } from '@/types/collections'

// Props
const props = defineProps<{
  guide: Guide
  authorName?: string
}>()

// Émissions
const emit = defineEmits<{
  like: []
  bookmark: []
  share: []
  scroll: []
}>()

// Computed
const authorName = computed(() => props.authorName || 'Anonymous')

// Méthodes
const getDifficultyLabel = (difficulty: string): string => {
  const labels: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
  }
  return labels[difficulty] || difficulty
}

const getLanguageLabel = (languageCode: string): string => {
  const languages: Record<string, string> = {
    EN: 'English',
    FR: 'French',
    ES: 'Spanish',
    DE: 'German',
    IT: 'Italian',
    PT: 'Portuguese',
    JA: 'Japanese',
    ZH: 'Chinese',
  }
  return languages[languageCode] || languageCode
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}

// Actions
const likeGuide = () => emit('like')
const bookmarkGuide = () => emit('bookmark')
const shareGuide = () => emit('share')

const scrollToContent = () => {
  const contentSection = document.querySelector('.guide-content')
  if (contentSection) {
    contentSection.scrollIntoView({ behavior: 'smooth' })
    emit('scroll')
  }
}
</script>

<style scoped>
.guide-header {
  position: relative;
  background: linear-gradient(135deg, var(--color-black), var(--color-darker-charcoal));
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  padding: var(--spacing-2xl) var(--spacing-md);
}

/* Background */
.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(26, 26, 26, 0.9));
  z-index: 2;
}

/* Contenu principal */
.header-content {
  position: relative;
  z-index: 10;
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

/* Badge de difficulté */
.difficulty-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-full);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 2px solid;
}

.difficulty-beginner {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4caf50;
  color: #4caf50;
}

.difficulty-intermediate {
  background: rgba(255, 193, 7, 0.2);
  border-color: var(--color-gold);
  color: var(--color-gold);
}

.difficulty-advanced {
  background: rgba(255, 152, 0, 0.2);
  border-color: var(--color-orange);
  color: var(--color-orange);
}

.difficulty-expert {
  background: rgba(244, 67, 54, 0.2);
  border-color: #f44336;
  color: #f44336;
}

.badge-icon {
  font-size: var(--font-size-base);
}

/* Titre et descriptions */
.guide-title {
  color: var(--color-cream);
  font-family: var(--font-primary);
  font-size: var(--font-size-4xl);
  font-weight: 900;
  line-height: 1.2;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.guide-subtitle {
  color: var(--color-gold);
  font-family: var(--font-secondary);
  font-size: var(--font-size-xl);
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
}

.guide-description {
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-lg);
  font-weight: 400;
  margin: 0;
  line-height: 1.6;
  max-width: 600px;
}

/* Métadonnées */
.guide-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  justify-content: center;
  margin: var(--spacing-md) 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-medium-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.meta-icon {
  color: var(--color-gold);
  font-size: var(--font-size-base);
}

/* Statistiques */
.guide-stats {
  display: flex;
  gap: var(--spacing-xl);
  padding: var(--spacing-lg) 0;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  font-weight: 600;
}

.stat-icon {
  color: var(--color-gold);
  font-size: var(--font-size-lg);
}

/* Actions */
.guide-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn--primary {
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
  color: var(--color-charcoal);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.action-btn--primary:hover {
  background: linear-gradient(135deg, var(--color-light-yellow), var(--color-gold));
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

.action-btn--secondary {
  background: transparent;
  color: var(--color-cream);
  border: 2px solid var(--color-gold);
}

.action-btn--secondary:hover {
  background: var(--color-gold);
  color: var(--color-charcoal);
  transform: translateY(-2px);
}

/* Indicateur de scroll */
.scroll-indicator {
  position: absolute;
  bottom: var(--spacing-xl);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-medium-gray);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: bounce 2s infinite;
}

.scroll-indicator:hover {
  color: var(--color-gold);
  transform: translateX(-50%) translateY(-5px);
}

.scroll-icon {
  font-size: var(--font-size-xl);
}

.scroll-text {
  font-family: var(--font-secondary);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .guide-header {
    min-height: 60vh;
    padding: var(--spacing-xl) var(--spacing-md);
  }

  .guide-title {
    font-size: var(--font-size-3xl);
  }

  .guide-subtitle {
    font-size: var(--font-size-lg);
  }

  .guide-description {
    font-size: var(--font-size-base);
  }

  .guide-meta {
    gap: var(--spacing-md);
  }

  .guide-stats {
    gap: var(--spacing-lg);
  }

  .guide-actions {
    flex-direction: column;
    width: 100%;
  }

  .action-btn {
    justify-content: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .guide-title {
    font-size: var(--font-size-2xl);
  }

  .guide-meta {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .guide-stats {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
}
</style>
