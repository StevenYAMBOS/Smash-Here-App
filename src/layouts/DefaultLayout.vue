<!-- src/layouts/DefaultLayout.vue -->

<template>
  <div class="layout-default">
    <NavBar />
    <main class="layout-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/FooTer.vue'
</script>

<style scoped>
.layout-default {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-darker-charcoal);
}

.layout-content {
  flex: 1;
}
</style>
