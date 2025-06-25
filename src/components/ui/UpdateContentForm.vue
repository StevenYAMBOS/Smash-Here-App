<!-- src/components/ui/UpdateContentForm.vue -->

<template>
  <form @submit.prevent="submit" class="update-content-form">
    <h2>Edit Content</h2>
    <div class="field">
      <label for="title">Title</label>
      <input id="title" v-model="title" type="text" required />
    </div>
    <div class="field">
      <label for="type">Type</label>
      <select id="type" v-model="type" required>
        <option value="" disabled>Select a type</option>
        <option value="video">Video</option>
        <option value="article">Article</option>
        <option value="page">Page (X, Reddit, website...)</option>
        <option value="roadmap">Roadmap</option>
        <option value="roadmap">Guide (Smash Here)</option>
      </select>
    </div>
    <div class="field">
      <label for="link">Link</label>
      <input id="link" v-model="link" type="url" required />
    </div>
    <div class="field">
      <label>Associate with steps</label>
      <MultiSelect
        :maxSelectedLabels="4"
        id="over_label"
        class="p-multiselect-field"
        v-model="selectedSteps"
        :options="availableSteps"
        optionLabel="title"
        optionValue="id"
        display="chip"
        size="normal"
        placeholder="Select steps"
        searchable
        filter
        showClear
        variant="filled"
        track-by="title"
      >
        <!-- Slot for each option in the dropdown -->
        <template #option="slotProps">
          <i class="pi pi-sitemap" style="margin-right: 0.5rem; color: var(--color-gold)"></i>
          {{ slotProps.option.title }}
        </template>
      </MultiSelect>
    </div>

    <div class="actions-row">
      <SubmitButton
        class="mr"
        label="Cancel"
        icon="pi-times-circle"
        iconPosition="left"
        variant="secondary"
        @click.prevent="emit('navigate', 'list-contents')"
      />
      <SubmitButton
        :label="loading ? 'Saving…' : 'Save changes'"
        :disabled="loading"
        icon="pi-save"
        iconPosition="left"
        variant="primary"
        type="submit"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'
import MultiSelect from 'primevue/multiselect'
import SubmitButton from './SubmitButton.vue'
import type { Content, Step } from '@/types/collections'
import { defineProps } from 'vue'

const toast = useToast()
const userStore = useUserStore()

const props = defineProps<{
  content: Content
}>()

const loading = ref(false)
const title = ref(props.content.title)
const type = ref(props.content.type)
const link = ref(props.content.link)
const selectedSteps = ref<string[]>([...(props.content.Steps || [])])

// On s'assure d'avoir la liste complète des steps de l'utilisateur
onMounted(async () => {
  if (!userStore.stepsCreated?.length) {
    await userStore.fetchUserSteps()
  }
})

// Options pour le MultiSelect
const availableSteps = computed<Step[]>(() => userStore.stepsCreated || [])

async function submit() {
  loading.value = true
  try {
    // 1) Mettre à jour les champs du content
    await fetch(`${import.meta.env.VITE_API_URL}/content/${props.content.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.token}`,
      },
      body: JSON.stringify({ title: title.value, type: type.value, link: link.value }),
    })

    // 2) Mettre à jour l'association steps
    await fetch(`${import.meta.env.VITE_API_URL}/contents/${props.content.id}/steps`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.token}`,
      },
      body: JSON.stringify({ Steps: selectedSteps.value }),
    })

    // 3) Mettre à jour le store
    const idx = userStore.contentsCreated.findIndex((c) => c.id === props.content.id)
    if (idx !== -1) {
      userStore.contentsCreated[idx] = {
        ...userStore.contentsCreated[idx],
        title: title.value,
        type: type.value,
        link: link.value,
        Steps: [...selectedSteps.value],
      }
    }

    await userStore.fetchProfile()
    toast.success('Content updated successfully!')
    // repasser au listing
    emit('navigate', 'list-contents')
  } catch (err) {
    console.error(err)
    toast.error('Update failed')
  } finally {
    loading.value = false
  }
}

// Pour revenir au listing après maj
import { defineEmits } from 'vue'

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()
</script>

<style scoped>
/* Container & Header */
form h2 {
  color: var(--color-cream);
  padding: 0 0 var(--spacing-md) 0;
  font-weight: bold;
  font-family: var(--font-primary);
}

/* Form Card */
.update-content-form {
  width: 100%;
  background: var(--color-darker-charcoal);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-md);
  max-width: 500px;
  margin: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

/* Common Field Styles */
.field {
  margin-bottom: var(--spacing-lg);
}
.field label {
  display: block;
  color: var(--color-cream);
  font-size: var(--font-size-sm);
  font-weight: bold;
  margin-bottom: var(--spacing-md);
}
.field input,
.field select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-medium-gray);
  background: var(--color-charcoal);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}
.field input:focus,
.field select:focus {
  outline: none;
  border-color: var(--color-gold);
  background: var(--color-dark-gray);
}

/* =============================
   PrimeVue MultiSelect Styling
   ============================= */

/* Wrapper to override default width */
.p-multiselect-field {
  width: 100% !important;
}

/* Input / Label area customization */
.p-multiselect {
  width: 100% !important;
  background: var(--color-charcoal) !important;
  color: var(--color-cream) !important;
  border: 1px solid var(--color-medium-gray) !important;
  border-radius: var(--radius-sm) !important;
  padding: var(--spacing-xs) var(--spacing-sm) !important;
  font-family: var(--font-secondary) !important;
  font-size: var(--font-size-base) !important;
  transition: border-color 0.2s ease;
}
.p-multiselect:focus-within {
  border-color: var(--color-gold) !important;
  background: var(--color-dark-gray) !important;
}

/* Placeholder text */
.p-multiselect-label {
  color: var(--color-light-gray) !important;
  padding: 0 !important;
}

/* Remove default remove icon hover color */
.p-multiselect .p-multiselect-token-icon {
  color: var(--color-charcoal) !important;
}

/* Dropdown Panel (options list) */
.p-multiselect-panel {
  background: var(--color-charcoal) !important;
  color: var(--color-cream) !important;
  border: 1px solid var(--color-medium-gray) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
  border-radius: var(--radius-sm) !important;
  max-height: 250px !important;
  overflow-y: auto !important;
}

/* Individual Option Item */
.p-multiselect-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md) !important;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.p-multiselect-item:hover {
  background: var(--color-gold) !important;
  color: var(--color-charcoal) !important;
}

/* Checkbox inside the option */
.p-multiselect-checkbox {
  border: 1px solid var(--color-cream) !important;
  background: var(--color-charcoal) !important;
  margin-right: var(--spacing-md) !important;
}
.p-multiselect-checkbox .p-checkbox-box {
  border-radius: var(--radius-sm) !important;
}
.p-multiselect-checkbox.p-highlight .p-checkbox-box {
  background: var(--color-gold) !important;
  border-color: var(--color-gold) !important;
}
.p-multiselect-checkbox.p-highlight .p-checkbox-icon {
  color: var(--color-charcoal) !important;
}

/* Label inside each option */
.p-multiselect-item-label {
  flex: 1;
  font-size: var(--font-size-base) !important;
}

/* Selected Chips (tokens) */
.p-multiselect-token {
  background: var(--color-gold) !important;
  color: var(--color-charcoal) !important;
  border-radius: var(--radius-sm) !important;
  margin-right: var(--spacing-xs) !important;
  display: flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm) !important;
}
.p-multiselect-token:hover {
  background: var(--color-light-yellow) !important;
}

/* Remove icon on the token */
.p-multiselect-token-icon {
  font-size: var(--font-size-sm) !important;
  margin-left: var(--spacing-xs) !important;
  cursor: pointer;
  transition: color 0.2s ease;
}
.p-multiselect-token-icon:hover {
  color: var(--color-charcoal) !important;
}

/* Scrollbar adjustments inside panel */
.p-multiselect-panel::-webkit-scrollbar {
  width: 6px;
}
.p-multiselect-panel::-webkit-scrollbar-track {
  background: var(--color-charcoal);
  border-radius: var(--radius-sm);
}
.p-multiselect-panel::-webkit-scrollbar-thumb {
  background: var(--color-medium-gray);
  border-radius: var(--radius-sm);
}
.p-multiselect-panel::-webkit-scrollbar-thumb:hover {
  background: var(--color-light-gray);
}

/* =============================
   Action Buttons Row
   ============================= */
.actions-row {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}
.mr {
  margin-right: var(--spacing-sm);
}

/* Ajoutez ces règles à la fin du <style scoped> de UpdateContentForm.vue */

/* 1. Override du champ de recherche à l’intérieur du MultiSelect (bordure verte par défaut) */
.p-multiselect-filter {
  width: 100% !important;
  background: var(--color-charcoal) !important;
  color: var(--color-cream) !important;
  border: 1px solid var(--color-medium-gray) !important;
  border-radius: var(--radius-sm) !important;
  padding: var(--spacing-sm) var(--spacing-md) !important;
  transition: border-color 0.2s ease !important;
}

.p-multiselect-filter:focus {
  outline: none !important;
  border-color: var(--color-gold) !important;
  background: var(--color-dark-gray) !important;
}

/* 2. Override des cases à cocher (checkbox) pour qu’elles soient “gold” au lieu de vert */

/* 2.a. Style de base de la case à cocher (bordure non cochée) */
.p-multiselect-checkbox .p-checkbox-box {
  border: 1px solid var(--color-cream) !important;
  background: var(--color-charcoal) !important;
  border-radius: var(--radius-sm) !important;
  width: 1.25rem !important;
  height: 1.25rem !important;
}

/* 2.b. Lorsque l’option est sélectionnée (p-highlight), on applique la couleur “gold” */
.p-multiselect-checkbox.p-highlight .p-checkbox-box,
.p-multiselect-item.p-highlight .p-checkbox-box {
  background: var(--color-gold) !important;
  border-color: var(--color-gold) !important;
}

/* 2.c. L’icône interne de la case à cocher (le “checkmark”) en mode sélectionné */
.p-multiselect-checkbox.p-highlight .p-checkbox-icon,
.p-multiselect-item.p-highlight .p-checkbox-icon {
  color: var(--color-charcoal) !important;
}

/* 3. Assurer la cohérence de la couleur de bordure du MultiSelect lui-même */
.p-multiselect.p-filled:focus-within,
.p-multiselect:focus-within {
  border-color: var(--color-gold) !important;
  background: var(--color-dark-gray) !important;
}

/* 4. Forcer la couleur du texte dans le filtre (pour que l’icône close reste crème) */
.p-multiselect-clear-icon {
  color: var(--color-cream) !important;
}
</style>
