<!-- src/components/ui/NavButton.vue -->

<template>
  <router-link :to="to" class="nav-button">
    <!-- Icône à gauche si demandé -->
    <i
      v-if="icon && iconPosition === 'left'"
      :class="['pi', icon, 'icon-left']"
    />
   <slot />
    <!-- Icône à droite si demandé -->
    <i
      v-if="icon && iconPosition === 'right'"
      :class="['pi', icon, 'icon-right']"
    />
  </router-link>
</template>

<script setup lang="ts">
 // On ajoute les props `icon` et `iconPosition` pour un affichage dynamique
 defineProps<{
   to: string
   icon?: string        // classe PrimeVue (ex: "pi-sign-in")
   iconPosition?: 'left' | 'right'
 }>()
</script>

<style scoped>
.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
  color: var(--color-charcoal);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.nav-button.full-width {
  width: 100%;
}
.nav-button.btn-primary {
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
  color: var(--color-charcoal);
}
.nav-button.btn-secondary {
  background: var(--color-charcoal);
  color: var(--color-cream);
  border: 1px solid var(--color-gold);
}
.nav-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
.nav-button:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-light-yellow), var(--color-gold));
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}
.loading-icon {
  font-size: 1.2em;
}
.icon-left {
  margin-right: var(--spacing-xs);
}
.icon-right {
  margin-left: var(--spacing-xs);
}
.label {
  display: inline-block;
  font-weight: bold;
}
</style>
