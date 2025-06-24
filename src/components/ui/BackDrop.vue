<!-- src/components/ui/BackDrop.vue -->
<template>
  <div class="backdrop" @click="$emit('close')" />
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
</style>
