<!-- src/views/NotFound/NotFoundView.vue -->

<template>
  <div class="not-found">
    <h1>404 - Page non trouvée</h1>
    <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
    <router-link to="/" class="back-home">Retour à l’accueil</router-link>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--color-cream);
  font-family: var(--font-secondary);
  text-align: center;
  gap: var(--spacing-md);
}

.back-home {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--color-gold);
  color: var(--color-black);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: bold;
}
</style>
