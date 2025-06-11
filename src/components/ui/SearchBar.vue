<!-- src/components/ui/SearchBar.vue -->

<template>
  <div class="search-bar">
    <i
      :class="modelValue ? 'pi pi-times' : 'pi pi-search'"
      class="search-icon"
      @click="handleIconClick"
    />
    <input type="text" :placeholder="placeholder" class="search-input" v-model="modelValue" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  placeholder: string
}>()

const modelValue = defineModel<string>({ default: '' })

const clearInput = () => {
  modelValue.value = ''
}

const handleIconClick = () => {
  if (modelValue.value) {
    clearInput()
  }
}
</script>

<style scoped>
.search-bar {
  width: 100%;
  max-width: 500px;
  min-width: 280px;
  height: 42px;
  background-color: var(--color-charcoal);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
  gap: var(--spacing-sm);
  transition: all 0.3s ease;
}

.search-icon {
  font-size: 1rem;
  color: var(--color-medium-gray);
  cursor: pointer;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.search-icon:hover {
  color: var(--color-gold);
}

.search-icon.pi-times {
  color: var(--color-gold);
}

.search-icon.pi-times:hover {
  color: #ff6b6b;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  min-width: 0; /* Permet au texte de se réduire */
}

.search-input::placeholder {
  color: var(--color-medium-gray);
  opacity: 0.8;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .search-bar {
    max-width: 100%;
    min-width: 250px;
    height: 40px;
  }

  .search-input {
    font-size: var(--font-size-sm);
  }
}

@media (max-width: 480px) {
  .search-bar {
    min-width: 200px;
    height: 38px;
    padding: 0 var(--spacing-sm);
  }

  .search-icon {
    font-size: 0.9rem;
  }

  .search-input {
    font-size: var(--font-size-sm);
  }
}
</style>
