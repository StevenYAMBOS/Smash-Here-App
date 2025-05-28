<!-- src/components/ui/StepDrawer.vue -->
<template>
  <Teleport to="body">
    <Backdrop v-if="visible" @close="$emit('close')" />

    <aside v-if="visible" class="drawer">
      <button class="close-btn" @click="$emit('close')">✕</button>

      <div class="drawer-content">
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
      </div>
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
  transition: transform 0.3s ease-in;
}

.drawer-content {
  padding: var(--spacing-3xl) 0;
}

/* Bouton fermer */
.close-btn {
  padding: 0 var(--spacing-sm);
  background: var(--color-cream);
  border: 1px solid var(--color-cream);
  border-radius: var(--radius-md);
  color: var(--color-black);
  font-size: 1.5rem;
  float: right;
  cursor: pointer;
}

.close-btn:hover {
  opacity: 70%;
  transition: background-color 0.3s ease-in-out;
}

/* Titre & description de l’étape */
.step-title {
  color: var(--color-gold);
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-4xl);
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
  color: var(--color-cream);
  font-weight: bold;
  text-decoration: none;
}
</style>
