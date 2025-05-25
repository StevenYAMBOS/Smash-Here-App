// src/components/ui/GameCardForSlider.vue

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import type { Game } from '@/types/collections'

const props = defineProps<{ game: Game }>()

// Génère un slug à partir du titre : kebab-case, lowercase, sans caractères spéciaux
const slug = computed(() =>
  props.game.title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, ''),
)
</script>

<template>
  <router-link :to="`/game/${slug}`" class="game-card">
    <img :src="game.cover" :alt="game.title" class="game-cover" />
    <h3 class="game-title">{{ game.title }}</h3>
    <span class="roadmap-count">
      {{ (game.Roadmaps ?? []).length }} roadmap{{ (game.Roadmaps ?? []).length > 1 ? 's' : '' }}
    </span>
  </router-link>
</template>

<style scoped>
.game-card {
  display: flex;
  flex-direction: column;
  align-content: center;
  text-align: start;
  padding: 1rem;
  background: var(--color-darker-charcoal);
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}
.game-card:hover {
  transform: scale(1.05);
}
.game-cover {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}
.game-title {
  font-family: var(--font-secondary);
  color: var(--color-cream);
  font-size: var(--font-size-base);
  text-align: start;
  margin: 0;
}

.game-card .roadmap-count {
  color: var(--color-medium-gray);
  font-size: var(--font-size-sm);
  margin-top: 0.25rem;
}
</style>
