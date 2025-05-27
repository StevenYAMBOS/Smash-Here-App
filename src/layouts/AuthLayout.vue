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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* pseudo-élément pour l’image de fond avec luminosité réduite */
.layout-auth::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../assets/background.webp') center/cover no-repeat;
  filter: brightness(0.5);
  z-index: -1;
}

.auth-content {
  position: relative; /* pour rester au-dessus du fond */
  z-index: 1;
  width: 100%;
  max-width: 500px;
  padding: var(--spacing-lg);
}
</style>
