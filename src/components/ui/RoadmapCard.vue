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
    </div>
    <!-- use PrimeVue Button for a bolder call-to-action -->
    <NavButton :to="`/roadmap/${id}`">Start</NavButton>
  </div>
</template>

<script setup lang="ts">
import NavButton from './NavButton.vue'

defineProps<{
  id: string
  title: string
  subTitle: string
  stepsCount: number
}>()
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

/* Responsive : stacking on smaller screens */
@media (max-width: 768px) {
  .roadmap-card {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  .start-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
