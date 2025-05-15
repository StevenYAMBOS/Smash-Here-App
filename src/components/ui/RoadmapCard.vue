<!-- src/components/ui/RoadmapCard.vue -->

<template>
  <div class="roadmap-card">
    <div class="roadmap-text">
      <h2 class="roadmap-title">{{ title }}</h2>
      <p class="roadmap-subtitle">{{ subTitle }}</p>
      <p class="roadmap-steps">{{ stepsCount }} steps</p>
    </div>
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
  height: 150px;
  width: 1000px;
  background-color: var(--color-charcoal);
  padding: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: var(--radius-md);
}

.roadmap-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-xs);
  /* padding: var(--spacing-md); */
}

.roadmap-title {
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-xl);
  font-weight: bold;
}

.roadmap-subtitle {
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
}

.roadmap-steps {
  color: var(--color-medium-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
}

@media (max-width: 1024px) {
  .roadmap-card {
    width: 100%;
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .roadmap-text {
    width: 100%;
  }

  .roadmap-title {
    font-size: var(--font-size-lg);
  }

  .roadmap-subtitle,
  .roadmap-steps {
    font-size: var(--font-size-sm);
  }
}
</style>
