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
  variant: { type: String as () => 'primary' | 'secondary' | 'danger', default: 'primary' },
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-xl);
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
.submit-button.full-width {
  width: 100%;
}
.submit-button.btn-primary {
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
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
  transform: none;
}
.submit-button:hover:not(:disabled) {
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
