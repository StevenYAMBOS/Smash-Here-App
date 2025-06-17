<!-- Modifications à apporter dans SearchBar.vue -->

<template>
  <div class="search-bar-container">
    <div class="search-bar" :class="{ 'search-bar--focused': isFocused, 'search-bar--has-value': modelValue }">
      <!-- Icone de recherche ou de suppression -->
      <i
        :class="modelValue ? 'pi pi-times' : 'pi pi-search'"
        class="search-icon"
        @click="handleIconClick"
      />
      
      <!-- Champ de saisie -->
      <input 
        ref="searchInput"
        type="text" 
        :placeholder="placeholder" 
        class="search-input" 
        v-model="modelValue"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleSearch"
        @keydown.escape="handleEscape"
      />
      
      <!-- Icone de raccourci clavier (optionnel) -->
      <div v-if="showShortcut && !modelValue && !isFocused" class="search-shortcut">
        <span class="shortcut-key">Ctrl</span>
        <span class="shortcut-plus">+</span>
        <span class="shortcut-key">K</span>
      </div>
      
      <!-- Loader pendant la recherche -->
      <i v-if="isLoading" class="pi pi-spinner search-loader" />
    </div>
    
    <!-- Indicateur de resultats -->
    <div v-if="showResultsCount && resultsCount !== null" class="search-results-count">
      {{ resultsCount }} results
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, onUnmounted } from 'vue'

// Props du composant
defineProps<{
  placeholder: string
  showShortcut?: boolean // Afficher le raccourci clavier
  showResultsCount?: boolean // Afficher le nombre de resultats
  resultsCount?: number // Nombre de resultats
  isLoading?: boolean // Etat de chargement
}>()

// Emissions du composant
const emit = defineEmits<{
  search: [query: string] // Emission lors de la recherche
  focus: [] // Emission lors du focus
  blur: [] // Emission lors de la perte de focus
}>()

// Modele de donnees
const modelValue = defineModel<string>({ default: '' })

// References et etats locaux
const searchInput = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

// Gestion du focus
const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}

const handleBlur = () => {
  isFocused.value = false
  emit('blur')
}

// Gestion des actions
const clearInput = () => {
  modelValue.value = ''
  searchInput.value?.focus()
}

const handleIconClick = () => {
  if (modelValue.value) {
    clearInput()
  } else {
    searchInput.value?.focus()
  }
}

const handleSearch = () => {
  if (modelValue.value.trim()) {
    emit('search', modelValue.value.trim())
  }
}

const handleEscape = () => {
  if (modelValue.value) {
    clearInput()
  } else {
    searchInput.value?.blur()
  }
}

// Raccourci clavier global Ctrl+K
const handleGlobalKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
  }
}

// Lifecycle hooks pour le raccourci clavier
onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style scoped>
.search-bar-container {
  width: 100%;
  max-width: 500px;
  min-width: 280px;
}

.search-bar {
  width: 100%;
  height: 42px;
  background: var(--color-charcoal);
  border: 2px solid transparent;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
  gap: var(--spacing-sm);
  position: relative;
  transition: all 0.3s ease;
  /* Ajouter une ombre subtile */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Etats de la barre de recherche */
.search-bar:hover {
  border-color: rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-bar--focused {
  border-color: var(--color-gold);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15);
  background: var(--color-dark-gray);
}

.search-bar--has-value {
  background: var(--color-dark-gray);
}

/* Icone de recherche/suppression */
.search-icon {
  font-size: 1rem;
  color: var(--color-medium-gray);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
}

.search-icon:hover {
  color: var(--color-gold);
  background: rgba(255, 215, 0, 0.1);
}

.search-icon.pi-times {
  color: var(--color-orange);
}

.search-icon.pi-times:hover {
  color: #ff4757;
  background: rgba(255, 71, 87, 0.1);
}

/* Champ de saisie */
.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  font-weight: 400;
  min-width: 0;
  /* Ameliorer la lisibilite */
  line-height: 1.4;
}

.search-input::placeholder {
  color: var(--color-medium-gray);
  opacity: 0.7;
  font-weight: 300;
}

.search-input:focus::placeholder {
  opacity: 0.5;
}

/* Raccourci clavier */
.search-shortcut {
  display: flex;
  align-items: center;
  gap: 2px;
  opacity: 0.6;
  font-size: var(--font-size-xs);
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
}

.shortcut-key {
  background: var(--color-darker-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-sm);
  padding: 2px 6px;
  font-weight: 500;
  font-size: 10px;
  line-height: 1;
}

.shortcut-plus {
  margin: 0 2px;
  font-weight: 300;
}

/* Loader de recherche */
.search-loader {
  font-size: 1rem;
  color: var(--color-gold);
  animation: spin 1s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Compteur de resultats */
.search-results-count {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-light-gray);
  text-align: right;
  font-family: var(--font-secondary);
  font-weight: 400;
}

/* Responsive optimise */
@media (max-width: 768px) {
  .search-bar-container {
    max-width: 250px;
  }

  .search-bar {
    height: 40px;
    padding: 0 var(--spacing-sm);
  }

  .search-input {
    font-size: var(--font-size-sm);
  }

  /* Masquer le raccourci sur mobile */
  .search-shortcut {
    display: none;
  }
}

@media (max-width: 480px) {
  .search-bar-container {
    max-width: 300px;
  }

  .search-bar {
    height: 38px;
    gap: var(--spacing-xs);
  }

  .search-icon {
    font-size: 0.9rem;
    padding: 2px;
  }

  .search-input {
    font-size: var(--font-size-sm);
  }

  .search-results-count {
    text-align: center;
    margin-top: var(--spacing-sm);
  }
}

/* Animations pour les etats */
@media (prefers-reduced-motion: no-preference) {
  .search-bar {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .search-icon {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* Support du dark mode (si necessaire) */
@media (prefers-color-scheme: dark) {
  .search-bar {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .search-bar:hover,
  .search-bar--focused {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
}
</style>