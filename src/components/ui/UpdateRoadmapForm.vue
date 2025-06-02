<!-- src/components/ui/UpdateRoadmapForm.vue -->

<template>
  <form @submit.prevent="submit" class="update-step-form">
    <h2>Edit Roadmap</h2>
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

    <!-- Champ Image de couverture -->
    <div class="field">
      <label for="cover">Cover</label>
      <input id="cover" v-model="cover" type="image" />
    </div>

    <!-- Champ Published (checkbox) -->
    <div class="field">
      <label>
        <input type="checkbox" v-model="published" />
        <span>Published</span>
      </label>
    </div>

    <!-- Champ Premium (checkbox) -->
    <div class="field">
      <label>
        <input type="checkbox" v-model="premium" />
        <span>Premium</span>
      </label>
    </div>

    <!-- Sélection des jeux existants -->
    <div class="field">
      <label>Games</label>
      <Multiselect
        v-model="selectedGames"
        :options="availableGames"
        label="title"
        track-by="id"
        placeholder="Select games"
        multiple
        close-on-select="false"
        class="multiselect-field"
      >
        <template #option="slotProps">
          <i class="pi pi-gamepad" style="margin-right: 0.5rem; color: var(--color-gold)"></i>
          {{ slotProps.option.title }}
        </template>
      </Multiselect>
    </div>

    <!-- CHAMP Étapes parentes -->
    <div class="field">
      <label>Étapes parent (sans PreviousSteps)</label>
      <Multiselect
        v-model="parentSteps"
        :options="availableStepsForHierarchy"
        label="title"
        track-by="id"
        placeholder="Sélectionnez les étapes parentes"
        multiple
        close-on-select="false"
        class="multiselect-field"
      >
        <template #option="slotProps">
          <i class="pi pi-sitemap" style="margin-right: 0.5rem; color: var(--color-gold)"></i>
          {{ slotProps.option.title }}
        </template>
      </Multiselect>
    </div>

    <!-- CHAMP Étapes enfants -->
    <div class="field">
      <label>Étapes enfants (les suivants)</label>
      <Multiselect
        v-model="childSteps"
        :options="availableStepsForHierarchy"
        label="title"
        track-by="id"
        placeholder="Sélectionnez les étapes enfants"
        multiple
        close-on-select="false"
        class="multiselect-field"
      >
        <template #option="slotProps">
          <i class="pi pi-sitemap" style="margin-right: 0.5rem; color: var(--color-gold)"></i>
          {{ slotProps.option.title }}
        </template>
      </Multiselect>
    </div>

    <div class="field">
      <label>Associate with steps</label>
      <MultiSelect
        id="over_label_steps"
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
        @click.prevent="emit('navigate', 'list-roadmaps')"
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
import type { Roadmap, Game, Step } from '@/types/collections'
import { defineProps } from 'vue'

const toast = useToast()
const userStore = useUserStore()

const props = defineProps<{
  roadmap: Roadmap
}>()

const loading = ref(false)
const title = ref(props.roadmap.title)
const subTitle = ref(props.roadmap.subTitle)
const description = ref(props.roadmap.description)
const cover = ref(props.roadmap.cover)
const published = ref(props.roadmap.published)
const premium = ref(props.roadmap.premium)
const selectedGames = ref<string[]>([...(props.roadmap.Games || [])])
const selectedSteps = ref<string[]>([...(props.roadmap.Steps || [])])

// NOUVEAUX REF pour la hiérarchie d’étapes
const parentSteps = ref<string[]>([]) // IDs des étapes “parent”
const childSteps = ref<string[]>([]) // IDs des étapes “enfant”

// On s'assure d'avoir la liste complète des steps de l'utilisateur

// Charger la liste complète des jeux et des étapes au montage
onMounted(async () => {
  if (!userStore.stepsCreated?.length) {
    await userStore.fetchUserSteps()
  }
  if (!userStore.games?.length) {
    await userStore.fetchAllGames()
  }

  // Initialiser parentSteps et childSteps avec l’existant, si on l’avait déjà défini dans props
  parentSteps.value =
    props.roadmap.Steps?.filter((sId) => {
      // une “étape parent” est une étape qui n’a pas de PreviousSteps
      const s = userStore.stepsCreated.find((step) => step.id === sId)
      return !s?.PreviousSteps?.length
    }) || []
  childSteps.value =
    props.roadmap.Steps?.filter((sId) => {
      // une “étape enfant” est une étape qui n’a pas de NextSteps
      const s = userStore.stepsCreated.find((step) => step.id === sId)
      return !s?.NextSteps?.length
    }) || []
})

// Options pour le MultiSelect
const availableSteps = computed<Step[]>(() => userStore.stepsCreated || [])
// On ne propose dans la hiérarchie que les étapes déjà associées à la roadmap
const availableStepsForHierarchy = computed<Step[]>(() => {
  return userStore.stepsCreated.filter((step) => props.roadmap.Steps?.includes(step.id))
})
const availableGames = computed<Game[]>(() => userStore.games || [])

async function submit() {
  loading.value = true
  try {
    // 1) Mettre à jour les champs de la roadmap
    await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${props.roadmap.id}`,
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
          Cover: cover.value,
          Published: published.value,
          Premium: premium.value,
        }),
      },
    )

    // 2) Mettre à jour l'association games
    await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmaps/${props.roadmap.id}/games`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.token}`,
        },
        body: JSON.stringify({ Games: selectedGames.value }),
      },
    )

    // 3) Mettre à jour l'association steps (ordre, parent, enfant)
    // 3.a) On met à jour d’abord la liste “brute” des Steps de la roadmap
    await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap/${props.roadmap.id}/steps`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.token}`,
        },
        body: JSON.stringify({ Steps: selectedSteps.value }),
      },
    )

    // 3.b) Pour chaque étape sélectionnée, on met à jour ses PreviousSteps et NextSteps
    for (const stepId of selectedSteps.value) {
      // Construire l’objet payload pour updateOneStep
      const payload: any = {}
      if (parentSteps.value.includes(stepId)) {
        payload.PreviousSteps = [] // une “étape parent” n’a pas de previous
      }
      if (childSteps.value.includes(stepId)) {
        payload.NextSteps = [] // une “étape enfant” n’a pas de next
      }
      // Envoyer la mise à jour sur /step/{id}
      if (Object.keys(payload).length) {
        await fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/step/${stepId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.token}`,
            },
            body: JSON.stringify(payload),
          },
        )
      }
    }

    // 3) Mettre à jour le store
    const idx = userStore.stepsCreated.findIndex((c) => c.id === props.step.id)
    if (idx !== -1) {
      userStore.stepsCreated[idx] = {
        ...userStore.stepsCreated[idx],
        title: title.value,
        subTitle: subTitle.value,
        description: description.value,
        description: description.value,
        cover: cover.value,
        published: published.value,
        premium: premium.value,
        Games: [...selectedGames.value],
        Steps: [...selectedSteps.value],
      }
    }

    toast.success('Roadmap updated successfully!')
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
  max-width: 600px;
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

/* Ajoutez ces règles à la fin du <style scoped> de UpdateRoadmapForm.vue */

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
