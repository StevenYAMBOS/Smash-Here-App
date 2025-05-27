<!-- src/components/ui/StepDrawer.vue -->
<template>
  <Teleport to="body">
    <Backdrop v-if="visible" @close="$emit('close')" />

    <aside v-if="visible" class="drawer">
      <button class="close-btn" @click="$emit('close')">✕</button>

      <h3 class="step-title">{{ step?.title }}</h3>
      <p class="step-desc">{{ step?.description }}</p>

      <template v-if="contents.length">
        <ul>
          <li v-for="c in contents" :key="c.id">
            <a :href="c.link" target="_blank">{{ c.title }}</a>
          </li>
        </ul>
      </template>
      <p v-else class="status">Aucun contenu à afficher.</p>
    </aside>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Content, Step } from '@/types/collections'
import Backdrop from './BackDrop.vue'

const props = defineProps<{
  visible: boolean
  step: Step | null
  contents: Content[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
/* panel latéral */
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: var(--color-darker-charcoal);
  padding: var(--spacing-lg);
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.3);
  z-index: 101;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

/* Bouton fermer */
.close-btn {
  background: none;
  border: none;
  color: var(--color-light-gray);
  font-size: 1.5rem;
  float: right;
  cursor: pointer;
}

/* Titre & description de l’étape */
.step-title {
  color: var(--color-gold);
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-2xl);
  font-family: var(--font-secondary);
  font-weight: bold;
}
.step-desc {
  color: var(--color-light-gray);
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-base);
  font-family: var(--font-secondary);
}

/* Liste des contenus */
.drawer ul {
  list-style: none;
  padding: 0;
}
.drawer li + li {
  margin-top: var(--spacing-sm);
}
.drawer a {
  color: var(--color-gold);
  text-decoration: none;
}
</style>
