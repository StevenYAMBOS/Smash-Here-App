<!-- src/components/ui/UserContentCard.vue -->

<template>
  <div class="user-content-card">
    <div class="info">
      <h3 class="title">{{ content.title }}</h3>
      <p class="type">{{ content.type }}</p>
      <p class="link">{{ content.link }}</p>
      <div class="meta">
        <span>
          <i class="pi pi-list"></i>
          {{ (content.Steps ?? []).length }} steps
        </span>
      </div>
    </div>
    <div class="actions">
      <Button
        v-if="showStats"
        icon="pi pi-chart-bar"
        class="p-button-text"
        title="Analytics"
        @click="$emit('stats', content.id)"
      />
      <Button
        v-if="showEdit"
        icon="pi pi-pencil"
        class="p-button-text"
        title="Edit"
        @click="$emit('edit', content.id)"
      />
      <Button
        v-if="showDelete"
        icon="pi pi-trash"
        class="p-button-text p-button-danger"
        title="Delete"
        @click="$emit('delete', content.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from 'vue'
import type { Content } from '@/types/collections'
import Button from 'primevue/button'

const props = withDefaults(
  defineProps<{
    content: Content
    showStats?: boolean
    showEdit?: boolean
    showDelete?: boolean
  }>(),
  {
    // showPublished: true,
    // showPremium: true,
  },
)

const emit = defineEmits<{
  (e: 'stats', id: string): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<style scoped>
.user-content-card {
  display: flex;
  align-items: stretch;
  background: var(--color-charcoal);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  margin-bottom: var(--spacing-lg);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.user-content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
}

.user-content-card::before {
  content: '';
  width: 5px;
  background: var(--color-gold);
}

.info {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  display: grid;
  grid-template-areas:
    'title'
    'type'
    'link'
    'meta';
  grid-gap: var(--spacing-sm);
}

.title {
  grid-area: title;
  font-size: var(--font-size-2xl);
  color: var(--color-cream);
  font-family: var(--font-primary);
  margin: 0;
}

.type {
  grid-area: type;
  font-size: var(--font-size-base);
  color: var(--color-light-gray);
  background: var(--color-darker-charcoal);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.link {
  grid-area: link;
  font-size: var(--font-size-base);
  color: var(--color-light-gray);
  background: var(--color-darker-charcoal);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  word-break: break-all;
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
