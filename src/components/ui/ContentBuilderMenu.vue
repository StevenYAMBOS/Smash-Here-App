<!-- src/components/ui/ContentBuilderMenu.vue -->

<template>
  <nav class="builder-menu">
    <h2>Content Builder</h2>
    <ul>
      <li>
        <div class="menu-header" @click="toggle('roadmaps')">
          Roadmaps
          <i :class="openSection === 'roadmaps' ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" />
        </div>
        <ul v-if="openSection === 'roadmaps'" class="submenu">
          <li @click="select('create-roadmap')">Create a new roadmap</li>
          <li @click="select('list-roadmaps')">Your roadmaps</li>
        </ul>
      </li>
      <li>
        <div class="menu-header" @click="toggle('steps')">
          Steps
          <i :class="openSection === 'steps' ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" />
        </div>
        <ul v-if="openSection === 'steps'" class="submenu">
          <li @click="select('create-step')">Create a new step</li>
          <li @click="select('list-steps')">Your steps</li>
        </ul>
      </li>
      <li>
        <div class="menu-header" @click="toggle('contents')">
          Contents
          <i :class="openSection === 'contents' ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" />
        </div>
        <ul v-if="openSection === 'contents'" class="submenu">
          <li @click="select('create-content')">Create a new content</li>
          <li @click="select('list-contents')">Your contents</li>
        </ul>
      </li>
      <li>
        <div class="menu-header" @click="toggle('guides')">
          Guides
          <i :class="openSection === 'guides' ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" />
        </div>
        <ul v-if="openSection === 'guides'" class="submenu">
          <li @click="select('create-guide')">Create a new guide</li>
          <li @click="select('list-guides')">Your guides</li>
        </ul>
      </li>
      <li>
        <div class="menu-header" @click="toggle('attachments')">
          Attachments
          <i
            :class="openSection === 'attachments' ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
          />
        </div>
        <ul v-if="openSection === 'attachments'" class="submenu">
          <li @click="select('create-attachment')">Create a new attachment</li>
          <li @click="select('list-attachments')">Your attachments</li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'

defineProps<{ selected: string }>()
// const emit = defineEmits(['update:selected', 'navigate'] as const)
const emit = defineEmits<{
  (e: 'update:selected', tab: string): void
  (e: 'navigate', tab: string): void
}>()

const openSection = ref<string | null>(null)

function toggle(section: string) {
  openSection.value = openSection.value === section ? null : section
}

function select(tab: string) {
  emit('update:selected', tab)
  emit('navigate', tab)
}
</script>

<style scoped>
.builder-menu {
  width: 220px;
  background: var(--color-dark-gray);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
}
.builder-menu h2 {
  color: var(--color-gold);
  padding: var(--spacing-md);
  font-weight: bold;
  font-family: var(--font-primary);
}
.builder-menu .menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-weight: bold;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

ul li {
  padding: var(--spacing-md);
  cursor: pointer;
  color: var(--color-cream);
}
li:hover {
  background: var(--color-darker-charcoal);
  font-weight: bold;
  border-radius: var(--radius-md);
}
.submenu {
  list-style: none;
  padding-left: var(--spacing-md);
}
.submenu li {
  padding: var(--spacing-md) 0;
  cursor: pointer;
  color: var(--color-light-gray);
}
.submenu li:hover {
  color: var(--color-cream);
}
</style>
