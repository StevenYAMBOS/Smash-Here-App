<!-- src/components/ui/UserRoadmapCard.vue -->

<template>
  <div class="user-roadmap-card">
    <div class="cover-wrapper">
      <img :src="roadmap.cover" :alt="roadmap.title" class="cover" />
    </div>
    <div class="info">
      <h3 class="title">{{ roadmap.title }}</h3>
      <p class="subTitle">{{ roadmap.subTitle }}</p>
      <p class="description">{{ roadmap.description }}</p>
      <div class="meta">
        <span>
          <i class="pi pi-list"></i>
          {{ (roadmap.Steps ?? []).length }} steps
        </span>
        <span v-if="props.showPublished">
          <i class="pi pi-check-circle"></i>
          {{ roadmap.published ? 'Published' : 'Draft' }}
        </span>
        <span v-if="props.showPremium">
          <i class="pi pi-star"></i>
          {{ roadmap.premium ? 'Premium' : 'Free' }}
        </span>
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

defineEmits<{
  (e: 'view', id: string): void
  (e: 'stats', id: string): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<style scoped>
.user-roadmap-card {
  display: flex;
  align-items: stretch;
  background: var(--color-charcoal);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  margin-bottom: var(--spacing-lg);
  cursor: pointer;
  max-height: 200px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.user-roadmap-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
}

/* .cover-wrapper {
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  padding-left: var(--spacing-md);
} */
.cover {
  width: 200px;
  height: 100%;
  object-fit: contain;
  border-radius: var(--radius-lg);
  padding-left: var(--spacing-md);
}

.info {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  display: grid;
  grid-template-areas:
    'title title'
    'subTitle subTitle'
    'description description'
    'meta meta';
  grid-row-gap: var(--spacing-sm);
}

.title {
  grid-area: title;
  font-size: var(--font-size-2xl);
  color: var(--color-cream);
  font-family: var(--font-primary);
  margin: 0;
}

.subTitle {
  grid-area: subTitle;
  font-size: var(--font-size-base);
  color: var(--color-light-gray);
  background: var(--color-darker-charcoal);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.description {
  grid-area: description;
  font-size: var(--font-size-sm);
  color: var(--color-medium-gray);
  margin: 0;
  word-break: break-all;
  /* Limiter le texte à 3 lignes maximum et ajouter “...” */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  grid-area: meta;
  display: flex;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-sm);
}

.meta span {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-light-gray);
}

.meta i {
  color: var(--color-gold);
  font-size: var(--font-size-base);
}

.actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: var(--spacing-md);
  gap: var(--spacing-md);
}

.actions ::v-deep(.p-button-text) {
  background: var(--color-darker-charcoal);
  border: none;
  color: var(--color-cream);
  transition:
    background-color 0.2s ease,
    opacity 0.2s ease;
}

.actions ::v-deep(.p-button-text:hover) {
  background: var(--color-dark-gray) !important;
  opacity: 0.8;
  color: var(--color-gold) !important;
}

.actions ::v-deep(.p-button-danger) {
  color: var(--color-cream) !important;
}

.actions ::v-deep(.p-button-danger:hover) {
  background: var(--color-light-yellow) !important;
  color: var(--color-charcoal) !important;
}
</style>
