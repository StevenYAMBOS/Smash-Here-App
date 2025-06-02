<!-- src/components/ui/UserStepCard.vue -->

<template>
  <div class="user-step-card">
    <div class="info">
      <h3 class="title">{{ step.title }}</h3>
      <p class="subTitle">{{ step.subTitle }}</p>
      <p class="description">{{ step.description }}</p>
      <div class="meta">
        <span> <i class="pi pi-bookmark" /> {{ (step.Roadmaps ?? []).length }} roadmaps </span>
        <span> <i class="pi pi-file" /> {{ (step.Contents ?? []).length }} contents </span>
      </div>
    </div>
    <div class="actions">
      <Button
        v-if="showStats"
        icon="pi pi-chart-bar"
        class="p-button-text"
        title="Analytics"
        @click="$emit('stats', step.id)"
      />
      <Button
        v-if="showEdit"
        icon="pi pi-pencil"
        class="p-button-text"
        title="Edit"
        @click="$emit('edit', step.id)"
      />
      <Button
        v-if="showDelete"
        icon="pi pi-trash"
        class="p-button-text p-button-danger"
        title="Delete"
        @click="$emit('delete', step.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from 'vue'
import type { Step } from '@/types/collections'
import Button from 'primevue/button'

const props = withDefaults(
  defineProps<{
    step: Step
    showStats?: boolean
    showEdit?: boolean
    showDelete?: boolean
  }>(),
  {},
)

const emit = defineEmits<{
  (e: 'stats', id: string): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()
console.log(emit, props)
</script>

<style scoped>
.user-step-card {
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
.user-step-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
}
.user-step-card::before {
  content: '';
  width: 5px;
  background: var(--color-gold);
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
  white-space: pre-wrap;
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
