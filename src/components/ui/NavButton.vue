<!-- src/components/ui/NavButton.vue -->

<template>
  <router-link :to="to" class="nav-button">
    <slot />
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
  to: string
}>()
</script>

<style scoped>
.nav-button {
  display: inline-block;
  background-color: var(--color-gold);
  color: var(--color-black);
  font-weight: 800;
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: var(--font-size-sm);
}

.nav-button:hover {
  background-color: var(--color-cream);
  color: var(--color-dark-gray);
}
</style>
