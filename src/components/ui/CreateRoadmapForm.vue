<!-- src/components/ui/CreateRoadmapForm.vue -->

<template>
  <form @submit.prevent="submit" class="create-roadmap-form">
    <h2>Create a new Roadmap</h2>

    <!-- Champ Titre -->
    <div class="field">
      <label for="title">Title</label>
      <input id="title" v-model="title" type="text" placeholder="New title" required />
    </div>

    <!-- Champ Sous-titre -->
    <div class="field">
      <label for="subTitle">Subtitle</label>
      <input id="subTitle" v-model="subTitle" type="text" placeholder="New subtitle" />
    </div>

    <!-- Champ Description -->
    <div class="field">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="description"
        rows="4"
        placeholder="New description"
        required
      ></textarea>
    </div>

    <div class="field">
      <!-- Champ Image de couverture -->
      <label for="cover">Cover Image</label>
      <div class="file-input-wrapper">
        <input
          id="cover"
          type="file"
          accept="image/webp,image/png,image/jpeg"
          @change="handleFileChange"
          class="file-input"
        />
        <button type="button" class="file-input-button" @click="triggerFileInput">
          <i class="pi pi-upload"></i>
          {{ coverFile ? coverFile.name : 'Choose an image' }}
        </button>
      </div>
      <p class="file-hint">Accepted formats: WEBP, PNG, JPEG (max 10MB)</p>
    </div>

    <!-- Champ Published (checkbox) -->
    <div class="field-row">
      <div class="switch-field">
        <label for="published-switch">Published</label>
        <button
          id="published-switch"
          type="button"
          class="switch-button"
          :class="{ active: published }"
          @click="published = !published"
          role="switch"
          :aria-checked="published"
        >
          <span class="switch-handle"></span>
        </button>
      </div>
      <!-- Champ Premium (checkbox) -->
      <!-- <div class="switch-field">
        <label for="premium-switch">Premium</label>
        <button
          id="premium-switch"
          type="button"
          class="switch-button"
          :class="{ active: premium }"
          @click="premium = !premium"
          role="switch"
          :aria-checked="premium"
        >
          <span class="switch-handle"></span>
        </button>
      </div> -->
    </div>

    <!-- Bouton de soumission -->
    <SubmitButton
      :label="loading ? 'Saving…' : 'Create roadmap'"
      :disabled="loading"
      icon="pi pi-save"
      iconPosition="left"
      variant="primary"
      type="submit"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { defineEmits } from 'vue'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import SubmitButton from './SubmitButton.vue'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'

const toast = useToast()
const userStore = useUserStore()
const title = ref('')
const subTitle = ref('')
const coverFile = ref<File | null>(null)
const description = ref('')
const published = ref(false)
// const premium = ref(false)
const loading = ref(false)

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    // Validate file type
    const validTypes = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (WEBP, PNG, or JPEG)')
      return
    }

    coverFile.value = file
  }
}

function triggerFileInput() {
  const fileInput = document.getElementById('cover') as HTMLInputElement
  fileInput?.click()
}

onMounted(async () => {
  await userStore.fetchAllGames()
})

async function submit() {
  if (loading.value) return

  // Validation
  if (!title.value || !subTitle.value || !description.value) {
    toast.error('Title, subtitle and description are required')
    return
  }

  // if (!coverFile.value) {
  //   toast.error('Cover image is required')
  //   return
  // }

  loading.value = true

  // Créer FormData pour multipart
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('subTitle', subTitle.value)
  formData.append('description', description.value)
  formData.append('cover', coverFile.value)
  formData.append('published', published.value.toString())
  // formData.append('premium', premium.value.toString())

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/roadmap`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userStore.token || localStorage.getItem('token')}`,
          // NE PAS définir Content-Type, le navigateur le fait automatiquement
        },
        body: formData,
      },
    )

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || `HTTP ${res.status}`)
    }

    toast.success('Roadmap created successfully!')

    // Réinitialiser le formulaire
    title.value = ''
    subTitle.value = ''
    description.value = ''
    coverFile.value = null
    published.value = false
    // premium.value = false

    // Réinitialiser l'input file
    const fileInput = document.getElementById('cover') as HTMLInputElement
    if (fileInput) fileInput.value = ''

    // Rafraîchir la liste des roadmaps
    await userStore.fetchProfile()
    emit('navigate', 'list-roadmaps')
  } catch (err) {
    console.error(err)
    toast.error(err instanceof Error ? err.message : 'Failed to create roadmap')
  } finally {
    loading.value = false
  }
}

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()
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
  font-weight: bold;
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

.file-input-wrapper {
  position: relative;
  width: 100%;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.file-input-button {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-sm);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all 0.2s ease;
}

.file-input-button:hover {
  border-color: var(--color-gold);
  background: var(--color-dark-gray);
}

.file-input-button i {
  color: var(--color-gold);
}

.file-hint {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-light-gray);
}

/* Checkbox row */
.field-row {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
}

.checkbox-label {
  display: flex;
  align-items: center;
  color: var(--color-cream);
  cursor: pointer;
}

.checkbox-label input[type='checkbox'] {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: var(--spacing-sm);
  accent-color: var(--color-gold);
}

/* Switch button styles */
.switch-field {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.switch-field label {
  color: var(--color-cream);
  font-size: var(--font-size-sm);
  font-weight: bold;
  margin: 0;
}

.switch-button {
  position: relative;
  width: 48px;
  height: 24px;
  background: var(--color-medium-gray);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 0;
}

.switch-button:hover {
  background: var(--color-light-gray);
}

.switch-button.active {
  background: var(--color-gold);
}

.switch-button.active:hover {
  background: var(--color-light-yellow);
}

.switch-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: var(--color-cream);
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch-button.active .switch-handle {
  transform: translateX(24px);
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
