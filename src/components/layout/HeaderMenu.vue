<template>
  <header class="header-menu" :class="{ 'header-menu--loading': isLoading }">
    <!-- Background animé avec particules -->
    <div class="background-animation">
      <div class="particles-container">
        <div
          v-for="particle in particles"
          :key="particle.id"
          class="particle"
          :style="particle.style"
        ></div>
      </div>

      <!-- Grille cyber avec effet de scan -->
      <div class="cyber-grid">
        <div class="grid-lines-vertical"></div>
        <div class="grid-lines-horizontal"></div>
        <div class="scan-line"></div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="header-content">
      <!-- Badge/Tag au-dessus du titre -->
      <div v-if="badge" class="header-badge">
        <i v-if="badgeIcon" :class="badgeIcon" class="badge-icon"></i>
        <span>{{ badge }}</span>
      </div>

      <!-- Titre principal avec effet de typing -->
      <h1 class="header-title" ref="titleRef">
        <span
          v-for="(char, index) in titleChars"
          :key="index"
          class="title-char"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          {{ char === ' ' ? '\u00A0' : char }}
        </span>
        <span class="title-cursor" :class="{ 'title-cursor--blink': showCursor }">|</span>
      </h1>

      <!-- Sous-titre avec animation -->
      <p class="header-subtitle" ref="subtitleRef">
        {{ subTitle }}
      </p>

      <!-- Statistiques/Metrics (si fournies) -->
      <div v-if="metrics && metrics.length > 0" class="header-metrics">
        <div v-for="metric in metrics" :key="metric.label" class="metric-item">
          <div class="metric-value">
            <CountUp :end-val="metric.value" :duration="2" />
            <span v-if="metric.suffix">{{ metric.suffix }}</span>
          </div>
          <div class="metric-label">{{ metric.label }}</div>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="header-actions">
        <!-- Bouton principal -->
        <button
          v-if="buttonText && buttonLink"
          class="header-button header-button--primary"
          @click="navigateTo"
          :disabled="isLoading"
        >
          <span class="button-content">
            <i v-if="buttonIcon" :class="buttonIcon" class="button-icon"></i>
            <span class="button-text">{{ buttonText }}</span>
          </span>
          <div class="button-glow"></div>
        </button>

        <!-- Bouton secondaire (optionnel) -->
        <button
          v-if="secondaryButtonText && secondaryButtonLink"
          class="header-button header-button--secondary"
          @click="navigateToSecondary"
          :disabled="isLoading"
        >
          <span class="button-content">
            <i v-if="secondaryButtonIcon" :class="secondaryButtonIcon" class="button-icon"></i>
            <span class="button-text">{{ secondaryButtonText }}</span>
          </span>
        </button>
      </div>

      <!-- Indicateurs sociaux/communauté -->
      <div v-if="showSocialProof" class="social-proof">
        <div class="social-item">
          <i class="pi pi-users social-icon"></i>
          <span>Join {{ formatNumber(communitySize) }}+ gamers</span>
        </div>
        <div class="social-item">
          <i class="pi pi-star social-icon"></i>
          <span>{{ rating }}/5 rating</span>
        </div>
      </div>

      <!-- Flèche de scroll (si activée) -->
      <div v-if="showScrollIndicator" class="scroll-indicator" @click="scrollToNext">
        <i class="pi pi-angle-down scroll-icon"></i>
        <span class="scroll-text">Scroll to explore</span>
      </div>
    </div>

    <!-- Loader overlay -->
    <Transition name="loader">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="loading-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
          <p class="loading-text">{{ loadingText || 'Loading...' }}</p>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// Interfaces pour les types
interface Metric {
  label: string
  value: number
  suffix?: string
}

interface Particle {
  id: number
  style: Record<string, string>
}

// Props du composant
const props = defineProps<{
  title: string
  subTitle: string
  buttonText?: string
  buttonLink?: string
  buttonIcon?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  secondaryButtonIcon?: string
  badge?: string
  badgeIcon?: string
  metrics?: Metric[]
  showSocialProof?: boolean
  communitySize?: number
  rating?: number
  showScrollIndicator?: boolean
  isLoading?: boolean
  loadingText?: string
}>()

// Émissions
const emit = defineEmits<{
  scroll: []
  buttonClick: []
  secondaryButtonClick: []
}>()

const router = useRouter()

// Références
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

// États réactifs
const showCursor = ref(true)
const particles = ref<Particle[]>([])

// Computed
const titleChars = computed(() => props.title.split(''))

// Composant CountUp simplifié
const CountUp = {
  props: ['endVal', 'duration'],
  setup(props: { endVal: number; duration: number }) {
    const displayValue = ref(0)

    onMounted(() => {
      const start = 0
      const end = props.endVal
      const duration = props.duration * 1000
      const startTime = Date.now()

      const animate = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)

        // Fonction d'easing
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        displayValue.value = Math.floor(start + (end - start) * easeOutCubic)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      // Délai avant le début de l'animation
      setTimeout(() => animate(), 500)
    })

    return { displayValue }
  },
  template: '<span>{{ displayValue.toLocaleString() }}</span>',
}

// Génération des particules
const generateParticles = () => {
  particles.value = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
    },
  }))
}

// Gestion du curseur clignotant
const handleCursorBlink = () => {
  setInterval(() => {
    showCursor.value = !showCursor.value
  }, 600)
}

// Navigation
const navigateTo = () => {
  if (props.buttonLink) {
    router.push(props.buttonLink)
    emit('buttonClick')
  }
}

const navigateToSecondary = () => {
  if (props.secondaryButtonLink) {
    router.push(props.secondaryButtonLink)
    emit('secondaryButtonClick')
  }
}

// Scroll vers la section suivante
const scrollToNext = () => {
  const nextSection = document.querySelector('main, .content, section')
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' })
    emit('scroll')
  }
}

// Formatage des nombres
const formatNumber = (num: number = 10000): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}

// Gestion des animations d'entrée
const animateOnLoad = async () => {
  await nextTick()

  // Animation du titre
  if (titleRef.value) {
    titleRef.value.classList.add('animate-in')
  }

  // Animation du sous-titre avec délai
  setTimeout(() => {
    if (subtitleRef.value) {
      subtitleRef.value.classList.add('animate-in')
    }
  }, 800)
}

// Lifecycle hooks
onMounted(() => {
  generateParticles()
  handleCursorBlink()
  animateOnLoad()
})

// Nettoyage
onUnmounted(() => {
  // Nettoyage si nécessaire
})
</script>

<style scoped>
.header-menu {
  position: relative;
  background: linear-gradient(135deg, var(--color-black), var(--color-darker-charcoal));
  min-height: 100vh;
  padding: var(--spacing-2xl) var(--spacing-md);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
}

/* Background animé */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--color-gold);
  border-radius: 50%;
  animation: float infinite linear;
  box-shadow: 0 0 4px var(--color-gold);
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Grille cyber */
.cyber-grid {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.1;
}

.grid-lines-vertical,
.grid-lines-horizontal {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 49px,
    var(--color-gold) 50px
  );
}

.grid-lines-horizontal {
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 49px,
    var(--color-gold) 50px
  );
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
  animation: scan 3s infinite;
}

@keyframes scan {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

/* Contenu principal */
.header-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
  max-width: 900px;
  width: 100%;
}

/* Badge */
.header-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid var(--color-gold);
  border-radius: var(--radius-full);
  padding: var(--spacing-sm) var(--spacing-lg);
  color: var(--color-gold);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: glow 2s infinite alternate;
}

@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
  }
  100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  }
}

.badge-icon {
  font-size: var(--font-size-base);
}

/* Titre avec effet typing */
.header-title {
  color: var(--color-cream);
  font-size: var(--font-size-5xl);
  font-family: var(--font-primary);
  font-weight: 900;
  margin: 0;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.title-char {
  display: inline-block;
  animation: fadeInUp 0.6s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title-cursor {
  color: var(--color-gold);
  font-weight: 300;
  transition: opacity 0.1s ease;
}

.title-cursor--blink {
  animation: blink 1.2s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

/* Sous-titre */
.header-subtitle {
  color: var(--color-light-gray);
  font-size: var(--font-size-xl);
  font-family: var(--font-secondary);
  font-weight: 400;
  margin: 0;
  line-height: 1.5;
  max-width: 600px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.header-subtitle.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Métriques */
.header-metrics {
  display: flex;
  gap: var(--spacing-2xl);
  margin: var(--spacing-lg) 0;
}

.metric-item {
  text-align: center;
}

.metric-value {
  color: var(--color-gold);
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  line-height: 1;
}

.metric-label {
  color: var(--color-medium-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-top: var(--spacing-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Boutons d'action */
.header-actions {
  display: flex;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.header-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg) var(--spacing-2xl);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  min-width: 180px;
}

.header-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.header-button--primary {
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
  color: var(--color-charcoal);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  color: var(--color-charcoal);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-secondary);
  font-size: var(--font-size-2xl);
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-button--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-light-yellow), var(--color-gold));
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
}

.header-button--secondary {
  background: transparent;
  color: var(--color-cream);
  border: 2px solid var(--color-gold);
}

.header-button--secondary:hover:not(:disabled) {
  background: var(--color-gold);
  color: var(--color-charcoal);
  transform: translateY(-3px);
}

.button-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: bold;
  font-size: var(--font-size-xl);
}

.button-icon {
  font-size: var(--font-size-lg);
  font-weight: bold;
}

.button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
  font-weight: bold;
}

.header-button--primary:hover .button-glow {
  left: 100%;
}

/* Social proof */
.social-proof {
  display: flex;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid rgba(255, 215, 0, 0.2);
}

.social-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-medium-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
}

.social-icon {
  color: var(--color-gold);
  font-size: var(--font-size-base);
}

/* Indicateur de scroll */
.scroll-indicator {
  position: absolute;
  bottom: var(--spacing-2xl);
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

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.loading-content {
  text-align: center;
  color: var(--color-cream);
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto var(--spacing-lg);
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-top: 2px solid var(--color-gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  border-top-color: var(--color-orange);
  animation-duration: 0.8s;
  animation-direction: reverse;
}

.spinner-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  border-top-color: var(--color-light-yellow);
  animation-duration: 0.6s;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  margin: 0;
}

/* Transitions */
.loader-enter-active,
.loader-leave-active {
  transition: all 0.3s ease;
}

.loader-enter-from,
.loader-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .header-menu {
    padding: var(--spacing-xl) var(--spacing-md);
  }

  .header-title {
    font-size: var(--font-size-3xl);
  }

  .header-subtitle {
    font-size: var(--font-size-lg);
  }

  .header-metrics {
    flex-wrap: wrap;
    gap: var(--spacing-lg);
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .header-button {
    width: 100%;
    min-width: auto;
  }

  .social-proof {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .scroll-indicator {
    bottom: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .header-content {
    gap: var(--spacing-lg);
  }

  .header-title {
    font-size: var(--font-size-2xl);
  }

  .header-subtitle {
    font-size: var(--font-size-base);
  }

  .header-button {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-base);
  }

  .metric-value {
    font-size: var(--font-size-xl);
  }

  .particles-container {
    display: none; /* Masquer les particules sur très petits écrans */
  }
}

@media (prefers-reduced-motion: reduce) {
  .particle,
  .scan-line,
  .title-char,
  .scroll-indicator {
    animation: none;
  }

  .header-subtitle {
    opacity: 1;
    transform: none;
  }
}
</style>
