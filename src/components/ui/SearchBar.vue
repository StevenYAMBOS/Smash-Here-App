<!-- src/components/ui/SearchBar.vue -->

<template>
  <div class="search-bar">
    <i class="pi pi-search search-icon"></i>
    <input type="text" :placeholder="placeholder" class="search-input" v-model="inputValue" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  placeholder: string
}>()

const inputValue = ref('')
</script>

<style scoped>
.search-bar {
  width: 500px;
  height: 42px;
  background-color: var(--color-charcoal);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
  gap: var(--spacing-sm);
}

.search-icon {
  font-size: 1rem;
  color: var(--color-medium-gray);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-medium-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
}
</style>
