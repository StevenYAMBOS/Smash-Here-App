<!-- src/components/ui/StepDrawer.vue -->
<template>
  <Teleport to="body">
    <Backdrop v-if="visible" @close="$emit('close')" />

    <aside v-if="visible" class="drawer">
      <div class="drawer-header">
        <h3 class="step-title">
          <i class="pi pi-flag-fill"></i>
          {{ step?.title }}
        </h3>
        <button class="close-btn" @click="$emit('close')">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="drawer-content">
        <p class="step-desc">{{ step?.description }}</p>

        <template v-if="contents.length">
          <div class="contents-list">
            <div v-for="c in contents" :key="c.id" class="content-item">
              <!-- Icône dynamique selon le type de contenu -->
              <i
                :class="{
                  'pi pi-play-circle': c.type === 'video',           // Icône vidéo
                  'pi pi-book': c.type === 'article',   // Icône article
                  'pi pi-external-link': c.type === 'link',  // Icône lien externe
                  'pi pi-sitemap': c.type === 'roadmap',     // Icône roadmap (même que RoadmapCard)
                  'pi pi-file': c.type === 'page',           // Icône page/document
                }"
                class="content-icon"
              />
              <a :href="c.link" target="_blank" class="content-link">
                {{ c.title }}
              </a>
            </div>
          </div>
        </template>
        <p v-else class="status">No content to show.</p>
      </div>
    </aside>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Content, Step } from '@/types/collections'
import Backdrop from './BackDrop.vue'

defineProps<{
  visible: boolean
  step: Step | null
  contents: Content[]
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
/* panel latéral */
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 30%;
  min-width: 320px;
  background: var(--color-darker-charcoal);
  border-left: 4px solid var(--color-gold);
  border-top-left-radius: var(--radius-md);
  border-bottom-left-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: -8px 0 16px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  z-index: 9999;
  overflow-y: auto;
  transition: transform 0.3s ease-in;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.drawer-content {
  padding: var(--spacing-3xl) 0;
}

/* Bouton fermer */
.close-btn {
  background: none;
  border: none;
  color: var(--color-light-gray);
  font-size: var(--font-size-2xl);
  cursor: pointer;
}
.close-btn:hover {
  color: var(--color-cream);
}

/* Titre & description de l’étape */
.step-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-3xl);
  color: var(--color-gold);
  font-family: var(--font-primary);
  margin: 0;
}

.step-desc {
  color: var(--color-medium-gray);
  margin-bottom: var(--spacing-lg);
  line-height: 1.4;
}

.contents-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
.content-item {
  display: flex;
  align-items: center;
  background: var(--color-charcoal);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}
.content-item:hover {
  background: var(--color-darker-charcoal);
}
.content-icon {
  font-size: var(--font-size-xl);
  color: var(--color-gold);
  margin-right: var(--spacing-md);
}
.content-link {
  color: var(--color-cream);
  font-family: var(--font-secondary);
  text-decoration: none;
  font-weight: 500;
}
.content-link:hover {
  text-decoration: underline;
}
.status {
  color: var(--color-light-gray);
  font-style: italic;
  text-align: center;
  margin-top: var(--spacing-2xl);
}
</style>
