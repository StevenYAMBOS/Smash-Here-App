<!-- src/components/ui/CreateRoadmapForm.vue -->

<template>
  <form @submit.prevent="submit" class="create-roadmap-form">
    <h2>Create a New Roadmap</h2>

    <!-- Champ Titre -->
    <div class="field">
      <label for="title">Titre</label>
      <input
        id="title"
        v-model="title"
        type="text"
        placeholder="Entrez le titre de la roadmap"
        required
      />
    </div>

    <!-- Champ Sous-titre -->
    <div class="field">
      <label for="subTitle">Sous-titre</label>
      <input id="subTitle" v-model="subTitle" type="text" placeholder="Entrez le sous-titre" />
    </div>

    <!-- Champ Description -->
    <div class="field">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="description"
        rows="4"
        placeholder="Entrez la description"
        required
      ></textarea>
    </div>

    <!-- Champ Image de couverture -->
    <div class="field">
      <label for="cover">Image de couverture (URL)</label>
      <input id="cover" v-model="cover" type="url" placeholder="https://example.com/cover.jpg" />
    </div>

    <!-- Champ Published (checkbox) -->
    <div class="field">
      <label>
        <input type="checkbox" v-model="published" />
        <span>Publié</span>
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
      <label>Jeux associés</label>
      <Multiselect
        v-model="selectedGames"
        :options="games"
        label="title"
        track-by="id"
        placeholder="Sélectionnez les jeux"
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

    <!-- Bouton de soumission -->
    <SubmitButton
      :label="loading ? 'Saving…' : 'Créer la roadmap'"
      :disabled="loading"
      icon="pi pi-save"
      iconPosition="left"
      variant="primary"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import SubmitButton from './SubmitButton.vue'
import type { Game } from '@/types/collections'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const title = ref('')
const subTitle = ref('')
const cover = ref('')
const description = ref('')
const published = ref(false)
const premium = ref(false)
const games = ref<Game[]>([])
const selectedGames = ref<string[]>([])
const loading = ref(false)

onMounted(async () => {
  await userStore.fetchAllGames()
})

async function submit() {
  if (loading.value) return
  loading.value = true

  const payload = {
    title: title.value,
    subTitle: subTitle.value,
    cover: cover.value,
    description: description.value,
    published: published.value,
    premium: premium.value,
    Games: selectedGames.value, // tableau d’IDs de jeux
  }

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      },
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    // TODO : rafraîchir la liste ou toast de succès
    title.value = ''
    subTitle.value = ''
    cover.value = ''
    description.value = ''
    published.value = false
    premium.value = false
    selectedGames.value = []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-roadmap-form {
  background: var(--color-darker-charcoal);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 600px;
  margin: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}
.create-roadmap-form h2 {
  color: var(--color-cream);
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-lg);
}
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
.field input[type='text'],
.field input[type='url'],
.field textarea,
.field select,
.field .multiselect-field {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-medium-gray);
  background: var(--color-charcoal);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease;
}
.field input[type='text']:focus,
.field input[type='url']:focus,
.field textarea:focus,
.field select:focus,
.field .multiselect-field:focus-within {
  outline: none;
  border-color: var(--color-gold);
  background: var(--color-dark-gray);
}

/* Checkbox personnalisé (Publié / Premium) */
.field input[type='checkbox'] {
  width: 1rem;
  height: 1rem;
  margin-right: var(--spacing-sm);
  accent-color: var(--color-gold);
}

/* =============================
   vue-multiselect Styling
   ============================= */
.multiselect-field {
  width: 100%;
}
.multiselect-field .multiselect__tags {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-charcoal) !important;
  border-radius: var(--radius-sm) !important;
}
.multiselect-field .multiselect__tags input {
  background: transparent !important;
  color: var(--color-cream) !important;
}
.multiselect-field .multiselect__content {
  background: var(--color-charcoal) !important;
  border: 1px solid var(--color-medium-gray) !important;
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
}
.multiselect-field .multiselect__element {
  background: var(--color-darker-charcoal) !important;
  color: var(--color-cream) !important;
  padding: var(--spacing-sm) var(--spacing-md);
  margin: var(--spacing-xs) 0 !important;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
}
.multiselect-field .multiselect__element:hover {
  background: var(--color-gold) !important;
  color: var(--color-charcoal) !important;
}
.multiselect-field .multiselect__tag {
  background: var(--color-gold) !important;
  color: var(--color-charcoal) !important;
  border-radius: var(--radius-sm);
  margin-right: var(--spacing-xs);
  display: flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
}
.multiselect-field .multiselect__tag-icon {
  margin-left: var(--spacing-xs);
  color: var(--color-charcoal);
  cursor: pointer;
}
.multiselect-field .multiselect__tag-close {
  color: var(--color-charcoal);
}
.multiselect-field .multiselect__spinner,
.multiselect-field .multiselect__loading {
  color: var(--color-gold);
}

/* Bouton de soumission */
.submit-btn {
  width: 100%;
  background: var(--color-gold);
  color: var(--color-charcoal);
  font-weight: bold;
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    opacity 0.3s ease,
    background-color 0.3s ease;
}
.submit-btn:hover {
  opacity: 0.8;
  background: var(--color-light-yellow);
}
</style>
