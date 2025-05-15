<!-- src/components/ui/SearchBar.vue -->

<template>
  <div class="search-bar">
    <i
      :class="modelValue ? 'pi pi-times' : 'pi pi-search'"
      class="search-icon"
      @click="modelValue && clearInput"
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
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
}
</style>
