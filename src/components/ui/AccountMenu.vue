<!-- src/components/ui/AccountMenu.vue -->
<template>
  <nav class="account-menu">
    <h2>User Account</h2>
    <ul>
      <li
        v-for="item in items"
        :key="item.key"
        :class="{ active: selected === item.key }"
        @click="select(item.key)"
      >
        {{ item.label }}
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{ selected: string }>()
const emit = defineEmits<(e: 'update:selected', val: string) => void>()

const items = [
  { key: 'informations', label: 'Informations' },
  { key: 'roadmaps', label: 'My roadmaps' },
  { key: 'bookmarks', label: 'Bookmarks' },
  // { key: 'chats', label: 'Chats' },
]

function select(key: string) {
  emit('update:selected', key)
}
</script>

<style scoped>
.account-menu {
  width: 200px;
  height: auto;
  background: var(--color-dark-gray);
  border-radius: var(--radius-md);
  overflow: hidden;
  padding: 0;
}

.account-menu h2 {
  color: var(--color-gold);
  padding: var(--spacing-md) var(--spacing-sm);
  font-weight: bold;
  font-family: var(--font-primary);
  text-align: start;
  margin: 0;
}

.account-menu ul {
  list-style: none;
  margin: 0;
  padding: 0 var(--spacing-sm);
  display: flex;
  flex-direction: column;
}

.account-menu li {
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-weight: bold;
  text-align: start;
}

.account-menu li.active,
.account-menu li:hover {
  background: var(--color-darker-charcoal);
  font-weight: bold;
  border-radius: var(--radius-md);
}

@media (max-width: 768px) {
  .account-menu {
    width: 100%;
    padding: var(--spacing-sm);
  }

  .account-menu h2 {
    color: var(--color-gold);
    padding: var(--spacing-md) var(--spacing-sm);
    font-weight: bold;
    font-family: var(--font-primary);
    text-align: start;
    margin: 0;
  }

  .account-menu ul {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
  }

  .account-menu li {
    padding: var(--spacing-sm) var(--spacing-md);
    color: var(--color-cream);
    font-family: var(--font-secondary);
    font-weight: bold;
    transition: all 0.2s ease;
    text-align: start;
  }
}

@media (max-width: 480px) {
  .account-menu {
    padding: var(--spacing-xs);
    width: 100%;
  }

  .account-menu h2 {
    padding: var(--spacing-sm);
    text-align: start;
  }

  .account-menu li {
    padding: var(--spacing-sm);
    text-align: start;
  }
}
</style>
