<!-- src/components/layout/HeaderGame.vue -->

<template>
  <header class="header-menu">
    <div class="header-game">
      <img :src="cover" alt="game cover" class="header-image" />

      <div class="header-text">
        <h1 class="header-title">{{ title }}</h1>
        <p class="header-subtitle">{{ description }}</p>
        <p class="header-count">{{ roadmapsCount }} roadmaps available</p>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  cover: string
  roadmapsCount: number
}>()
</script>

<style scoped>
.header-menu {
  background-color: var(--color-black);
  padding: var(--spacing-2xl) var(--spacing-md);
}

.header-game {
  background-color: var(--color-black);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) 0;
}

.header-image {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.header-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header-title {
  color: var(--color-cream);
  font-size: var(--font-size-5xl);
  font-family: var(--font-primary);
  font-weight: bold;
}

.header-subtitle {
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
  margin-top: var(--spacing-sm);
}

.header-count {
  color: var(--color-gold);
  font-family: var(--font-secondary);
  margin-top: var(--spacing-sm);
}

@media (max-width: 768px) {
  .header-game {
    flex-direction: column;
    text-align: center;
  }

  .header-image {
    width: 100%;
    max-width: 300px;
    height: auto;
  }

  .header-text {
    align-items: center;
  }

  .header-title {
    font-size: var(--font-size-3xl);
  }

  .header-subtitle {
    font-size: var(--font-size-sm);
  }
}
</style>
