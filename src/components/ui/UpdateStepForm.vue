<!-- src/components/ui/UpdateStepForm.vue -->

<template>
  <form @submit.prevent="submit" class="update-step-form">
    <h2>Edit Step</h2>
    <div class="field">
      <label for="title">Title</label>
      <input id="title" v-model="title" type="text" required />
    </div>

    <div class="field">
      <label for="subTitle">Subtitle</label>
      <input id="subTitle" v-model="subTitle" type="text" required />
    </div>

    <div class="field">
      <label for="description">Description</label>
      <textarea id="description" v-model="description" rows="3" required></textarea>
    </div>

    <div class="field">
      <label>Associate with roadmaps</label>
      <MultiSelect
        id="over_label_roadmaps"
        class="p-multiselect-field"
        v-model="selectedRoadmaps"
        :options="availableRoadmaps"
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

    <div class="field">
      <label>Associate with contents</label>
      <MultiSelect
        id="over_label_content"
        class="p-multiselect-field"
        v-model="selectedContents"
        :options="availableContents"
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
        @click.prevent="emit('navigate', 'list-steps')"
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
import type { Step, Content, Roadmap } from '@/types/collections'
import { defineProps } from 'vue'

const toast = useToast()
const userStore = useUserStore()

const props = defineProps<{
  step: Step
}>()

const loading = ref(false)
const title = ref(props.step.title)
const subTitle = ref(props.step.subTitle)
const description = ref(props.step.description)
const selectedRoadmaps = ref<string[]>([...(props.step.Roadmaps || [])])
const selectedContents = ref<string[]>([...(props.step.Contents || [])])

// On s'assure d'avoir la liste complète des steps de l'utilisateur
onMounted(async () => {
  if (!userStore.contentsCreated?.length || !userStore.roadmapsCreated?.length) {
    await userStore.fetchUserRoadmaps()
    await userStore.fetchUserContents()
  }
})

// Options pour le MultiSelect
const availableRoadmaps = computed<Roadmap[]>(() => userStore.roadmapsCreated || [])
const availableContents = computed<Content[]>(() => userStore.contentsCreated || [])

async function submit() {
  loading.value = true
  try {
    // 1) Mettre à jour les champs du step
    await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/step/${props.step.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.token}`,
        },
        body: JSON.stringify({
          Title: title.value,
          Subtitle: subTitle.value,
          Description: description.value,
        }),
      },
    )

    // 2) Mettre à jour l'association roadmaps
    await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/steps/${props.step.id}/roadmaps`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.token}`,
        },
        body: JSON.stringify({ Roadmaps: selectedRoadmaps.value }),
      },
    )
    // On doit appeler l’endpoint “PUT /contents/{contentId}/steps” pour chaque contentId
    for (const cId of selectedContents.value) {
      await fetch(
        `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/contents/${cId}/steps`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.token}`,
          },
          body: JSON.stringify({ Steps: [props.step.id] }),
        },
      )
    }

    // 3) Mettre à jour le store
    const idx = userStore.stepsCreated.findIndex((c) => c.id === props.step.id)
    if (idx !== -1) {
      userStore.stepsCreated[idx] = {
        ...userStore.stepsCreated[idx],
        title: title.value,
        subTitle: subTitle.value,
        description: description.value,
        Roadmaps: [...selectedRoadmaps.value],
        Contents: [...selectedContents.value],
      }
    }

    toast.success('Step updated successfully!')
    // repasser au listing
    emit('navigate', 'list-steps')
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
.update-step-form {
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
.field textarea,
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
.field textarea:focus,
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
  justify-step: flex-start;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}
.mr {
  margin-right: var(--spacing-sm);
}

/* Ajoutez ces règles à la fin du <style scoped> de UpdateStepForm.vue */

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
