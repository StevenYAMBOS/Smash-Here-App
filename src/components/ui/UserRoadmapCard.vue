<!-- src/components/ui/UserRoadmapCard.vue -->

<template>
  <div class="user-roadmap-card">
    <img :src="roadmap.cover" :alt="roadmap.title" class="cover" />
    <div class="info">
      <h3 class="title">{{ roadmap.title }}</h3>
      <p class="subtitle">{{ roadmap.subTitle }}</p>
      <div class="meta">
        <span>{{ (roadmap.Steps ?? []).length }} steps</span>
        <span v-if="props.showPublished"> Published : {{ roadmap.published ? 'Yes' : 'No' }} </span>
        <span v-if="props.showPremium"> Premium : {{ roadmap.premium ? 'Yes' : 'No' }} </span>
      </div>
    </div>
    <div class="actions">
      <Button
        v-if="showView"
        icon="pi pi-eye"
        class="p-button-text"
        title="Show"
        @click="$emit('view', roadmap.id)"
      />
      <Button
        v-if="showStats"
        icon="pi pi-chart-bar"
        class="p-button-text"
        title="Analytics"
        @click="$emit('stats', roadmap.id)"
      />
      <Button
        v-if="showEdit"
        icon="pi pi-pencil"
        class="p-button-text"
        title="Edit"
        @click="$emit('edit', roadmap.id)"
      />
      <Button
        v-if="showDelete"
        icon="pi pi-trash"
        class="p-button-text p-button-danger"
        title="Delete"
        @click="$emit('delete', roadmap.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from 'vue'
import type { Roadmap } from '@/types/collections'
import Button from 'primevue/button'

const props = withDefaults(
  defineProps<{
    roadmap: Roadmap
    showView?: boolean
    showStats?: boolean
    showEdit?: boolean
    showDelete?: boolean
    showPublished?: boolean
    showPremium?: boolean
  }>(),
  {
    showPublished: true,
    showPremium: true,
  },
)

const emit = defineEmits<{
  (e: 'view', id: string): void
  (e: 'stats', id: string): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()

console.log(props, emit)
</script>

<style scoped>
.user-roadmap-card {
  display: flex;
  background: var(--color-charcoal);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
}
.cover {
  width: 300px;
  object-fit: cover;
  border-radius: var(--radius-md);
}
.info {
  padding: var(--spacing-md);
  flex: 1;
  display: flex;
  flex-direction: column;
}
.title {
  font-size: var(--font-size-lg);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-weight: bold;
  margin: 0 0 var(--spacing-xs);
}
.subtitle {
  font-size: var(--font-size-base);
  color: var(--color-light-gray);
  margin: 0 0 var(--spacing-sm);
}
.meta span {
  margin-right: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-medium-gray);
}

.actions {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.actions button {
  margin-right: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-cream);
  color: var(--color-black);
  cursor: pointer;
}

.actions ::v-deep(.p-button-text:hover) {
  opacity: 0.7;
  transition: background-color 0.3s ease-in-out;
  color: var(--color-cream) !important;
}
</style>
