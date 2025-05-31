<!-- src/components/ui/UserContentCard.vue -->

<template>
  <div class="user-content-card">
    <div class="info">
      <h3 class="title">{{ content.title }}</h3>
      <p class="type">Type of content : {{ content.type }}</p>
      <p class="type">{{ content.link }}</p>
      <div class="meta">
        <span>Associated with {{ (content.Steps ?? []).length }} steps</span>
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

console.log(props, emit)
</script>

<style scoped>
.user-content-card {
  display: flex;
  background: var(--color-charcoal);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
}
.user-content-card::before {
  content: '';
  width: 4px;
  background: var(--color-gold);
  border-top-left-radius: var(--radius-md);
  border-bottom-left-radius: var(--radius-md);
}

.user-content-card::before {
  content: '';
  width: 4px;
  background: var(--color-gold);
  border-top-left-radius: var(--radius-md);
  border-bottom-left-radius: var(--radius-md);
}

/* SECTION infos repensée */
.info {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  display: grid;
  grid-template-areas:
    'title title'
    'type link'
    'meta meta';
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
  font-size: var(--font-size-sm);
  color: var(--color-gold);
  word-break: break-all;
  text-decoration: underline;
}

.meta {
  grid-area: meta;
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
}

.meta span {
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
