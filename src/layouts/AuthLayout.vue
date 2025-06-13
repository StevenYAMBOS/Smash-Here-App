<!-- src/layouts/AuthLayout.vue -->

<template>
  <div class="layout-auth">
    <!-- Bouton de retour à l'accueil -->
    <router-link to="/" class="back-to-home-btn">
      <i class="pi pi-home"></i>
      <span>Back to Home</span>
    </router-link>

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
  max-width: 1500px;
  padding: var(--spacing-lg);
}

/* Bouton de retour à l'accueil */
.back-to-home-btn {
  position: fixed;
  top: var(--spacing-xl);
  left: var(--spacing-xl);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: rgba(37, 37, 37, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: var(--radius-full);
  color: var(--color-cream);
  text-decoration: none;
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.back-to-home-btn:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: var(--color-gold);
  color: var(--color-gold);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.2);
}

.back-to-home-btn i {
  font-size: var(--font-size-base);
  transition: color 0.3s ease;
}

.back-to-home-btn:hover i {
  color: var(--color-gold);
}

/* Responsive pour mobile */
@media (max-width: 768px) {
  .back-to-home-btn {
    top: var(--spacing-lg);
    left: var(--spacing-lg);
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .back-to-home-btn span {
    display: none; /* Masquer le texte sur mobile */
  }
}

@media (max-width: 480px) {
  .back-to-home-btn {
    top: var(--spacing-md);
    left: var(--spacing-md);
    padding: var(--spacing-sm);
    border-radius: 50%;
    width: 44px;
    height: 44px;
    justify-content: center;
  }
}
</style>
