<!-- src/components/ui/SubmitButton.vue -->

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['submit-button', variantClass, { 'full-width': fullWidth }]"
    @click="handleClick"
    :title="tooltip"
    :aria-label="ariaLabel"
  >
    <!-- Icône de chargement -->
    <i v-if="loading" class="pi pi-spin pi-spinner loading-icon" />
    <!-- Icône avant le texte -->
    <i v-else-if="icon && iconPosition === 'left'" :class="['pi', icon, 'icon-left']" />
    <span class="label">{{ label }}</span>
    <!-- Icône après le texte -->
    <i v-if="icon && iconPosition === 'right'" :class="['pi', icon, 'icon-right']" />
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  /** Texte du bouton */
  label: { type: String, required: true },
  /** Type HTML du bouton */
  type: { type: String as () => 'button' | 'submit' | 'reset', default: 'button' },
  /** Désactive le bouton */
  disabled: { type: Boolean, default: false },
  /** Affiche l’icône de chargement */
  loading: { type: Boolean, default: false },
  /** Classe d’icône PrimeIcons (ex: 'pi-check') */
  icon: { type: String, default: '' },
  /** Position de l’icône ('left' ou 'right') */
  iconPosition: { type: String as () => 'left' | 'right', default: 'left' },
  /** Pleine largeur */
  fullWidth: { type: Boolean, default: false },
  /** Variante de style ('primary' ou 'secondary') */
  variant: { type: String as () => 'primary' | 'secondary', default: 'primary' },
  /** Tooltip (title) */
  tooltip: { type: String, default: '' },
  /** aria-label pour accessibilité */
  ariaLabel: { type: String, default: '' },
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick(e: MouseEvent) {
  if (!props.disabled && !props.loading) emit('click', e)
}

// Calcul de la classe en fonction de la variante
const variantClass = props.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'
</script>

<style scoped>
.submit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition:
    opacity 0.3s ease,
    background-color 0.3s ease;
}
.submit-button.full-width {
  width: 100%;
}
.submit-button.btn-primary {
  background: var(--color-gold);
  color: var(--color-charcoal);
}
.submit-button.btn-secondary {
  background: var(--color-charcoal);
  color: var(--color-cream);
  border: 1px solid var(--color-gold);
}
.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.submit-button:hover:not(:disabled) {
  opacity: 0.8;
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
