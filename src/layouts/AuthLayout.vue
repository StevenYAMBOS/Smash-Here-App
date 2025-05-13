<!-- src/layouts/AuthLayout.vue -->

<template>
  <div class="layout-auth">
    <main class="auth-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout-auth {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-darker-charcoal);
}

.auth-content {
  width: 100%;
  max-width: 500px;
  padding: var(--spacing-lg);
}
</style>
