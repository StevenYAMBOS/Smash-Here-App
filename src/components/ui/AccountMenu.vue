<!-- src/components/ui/AccountMenu.vue -->
<template>
  <nav class="account-menu">
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

const props = defineProps<{ selected: string }>()
const emit = defineEmits<(e: 'update:selected', val: string) => void>()

const items = [
  { key: 'Informations', label: 'Informations' },
  { key: 'My roadmaps', label: 'My roadmaps' },
  { key: 'Bookmarks', label: 'Bookmarks' },
  { key: 'Chats', label: 'Chats' },
]

function select(key: string) {
  emit('update:selected', key)
}
</script>

<style scoped>
.account-menu {
  width: 200px;
  background: var(--color-charcoal);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.account-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.account-menu li {
  padding: var(--spacing-md);
  cursor: pointer;
  color: var(--color-cream);
}
.account-menu li.active,
.account-menu li:hover {
  background: var(--color-darker-charcoal);
  font-weight: bold;
}
</style>
