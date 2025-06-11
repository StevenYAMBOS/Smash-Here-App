// src/components/ui/RoadmapCardForSlider.vue

<template>
  <router-link :to="`/roadmap/${roadmap.id}`" class="roadmap-card">
    <img :src="roadmap.cover" :alt="roadmap.title" class="roadmap-cover" />
    <h3 class="roadmap-title">{{ roadmap.title }}</h3>
    <span class="step-count">
      {{ (roadmap.Steps ?? []).length }} step{{ (roadmap.Steps ?? []).length > 1 ? 's' : '' }}
    </span>
  </router-link>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Roadmap } from '@/types/collections'

defineProps<{ roadmap: Roadmap }>()
</script>

<style scoped>
.roadmap-card {
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
.roadmap-card:hover {
  transform: scale(1.05);
}
.roadmap-cover {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}
.roadmap-title {
  font-family: var(--font-secondary);
  color: var(--color-cream);
  font-size: var(--font-size-base);
  text-align: start;
  margin: 0;
}
.step-count {
  color: var(--color-medium-gray);
  font-size: var(--font-size-sm);
  margin-top: 0.25rem;
  text-align: start;
}
</style>
