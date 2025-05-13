<!-- src/components/ui/GameCard.vue -->

<template>
  <div class="game-card">
    <img :src="imageSrc" :alt="title" class="game-image" />
    <h2 class="game-title">{{ title }}</h2>
    <p class="game-subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  imageSrc: string
  title: string
  subtitle: string
}>()
</script>

<style scoped>
.game-card {
  width: 400px;
  height: 400px;
  background-color: var(--color-charcoal);
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
}

.game-image {
  width: 360px;
  height: 220px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.game-title {
  margin-top: var(--spacing-md);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-xl);
  text-align: center;
}

.game-subtitle {
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  text-align: center;
  margin-top: var(--spacing-xs);
}
</style>
