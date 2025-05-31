<!-- src/components/ui/CreateRoadmapForm.vue -->

<template>
  <form @submit.prevent="submit">
    <div class="field">
      <label>Titre</label>
      <input v-model="title" type="text" required />
    </div>
    <div class="field">
      <label>Description</label>
      <textarea v-model="description" rows="4" />
    </div>
    <div class="field">
      <label>Étapes (select multiple)</label>
      <select v-model="selectedSteps" multiple>
        <option v-for="s in steps" :key="s.id" :value="s.id">{{ s.title }}</option>
      </select>
    </div>
    <div class="field">
      <label>Contenus (chips)</label>
      <Multiselect
        v-model="selectedContents"
        :options="contents"
        label="title"
        track-by="id"
        multiple
        taggable
      />
    </div>
    <button type="submit">Créer la roadmap</button>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Step, Content } from '@/types/collections'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

const title = ref('')
const description = ref('')
const steps = ref<Step[]>([])
const contents = ref<Content[]>([])
const selectedSteps = ref<string[]>([])
const selectedContents = ref<Content[]>([])

onMounted(async () => {
  steps.value = await fetch(`${import.meta.env.VITE_API_URL}/steps`).then((r) => r.json())
  contents.value = await fetch(`${import.meta.env.VITE_API_URL}/contents`).then((r) => r.json())
})

async function submit() {
  const payload = {
    title: title.value,
    description: description.value,
    steps: selectedSteps.value,
    contents: selectedContents.value.map((c) => c.id),
  }
  await fetch(`${import.meta.env.VITE_API_URL}/roadmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  // TODO: refresh la liste ou toast de succès
}
</script>

<style scoped>
.field {
  margin-bottom: var(--spacing-lg);
}
.field label {
  display: block;
  color: var(--color-cream);
  margin-bottom: var(--spacing-xs);
}
.field input,
.field textarea,
.field select,
.vue-multiselect {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-medium-gray);
  background: var(--color-darker-charcoal);
  color: var(--color-cream);
}
button {
  background: var(--color-gold);
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-sm);
  cursor: pointer;
}
</style>
