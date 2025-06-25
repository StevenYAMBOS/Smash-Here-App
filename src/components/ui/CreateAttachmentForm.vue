<!-- src/components/ui/CreateAttachmentForm.vue -->

<template>
  <form @submit.prevent="submit" class="create-attachment-form">
    <h2>Create a new attachment</h2>

    <!-- URL -->
    <div class="field">
      <!-- Champ Image de couverture -->
      <label for="url">File</label>
      <div class="file-input-wrapper">
        <input
          id="url"
          type="file"
          accept="image/webp,image/png,image/jpeg/pdf/doc/docx/txt/mp4/webm"
          @change="handleFileChange"
          class="file-input"
        />
        <button type="button" class="file-input-button" @click="triggerFileInput">
          <i class="pi pi-upload"></i>
          {{ urlFile ? urlFile.name : 'Choose an image' }}
        </button>
      </div>
      <p class="file-hint">
        Accepted formats: WEBP, PNG, JPEG, PDF, DOC, DOCX, TXT, MP4, WEBM (max 10MB)
      </p>
    </div>

    <!-- Champ Titre -->
    <div class="field">
      <label for="fileName">Filename*</label>
      <input id="fileName" v-model="fileName" type="text" placeholder="New filename" required />
    </div>

    <!-- Champ Alt text -->
    <div class="field">
      <label for="alt">Alt text*</label>
      <input id="alt" v-model="alt" type="text" placeholder="New subtitle" />
    </div>

    <!-- Champ Caption -->
    <div class="field">
      <label for="caption">Caption</label>
      <input id="caption" v-model="caption" type="text" placeholder="New subtitle" />
    </div>

    <!-- Bouton de soumission -->
    <SubmitButton
      :label="loading ? 'Saving…' : 'Create attachment'"
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
const fileName = ref('')
const alt = ref('')
const caption = ref('')
const urlFile = ref<File | null>(null)
const loading = ref(false)

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validation taille (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    // Validation des types de fichiers étendus
    const validTypes = [
      'image/webp',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'video/mp4',
      'video/webm',
    ]

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid file (Image, PDF, DOC, DOCX, TXT, MP4, WEBM)')
      return
    }

    urlFile.value = file

    // Mise à jour automatique du fileName si vide
    if (!fileName.value) {
      fileName.value = file.name.split('.')[0]
    }
  }
}

function triggerFileInput() {
  const fileInput = document.getElementById('url') as HTMLInputElement
  fileInput?.click()
}

onMounted(async () => {
  await userStore.fetchAllGames()
})

async function submit() {
  if (loading.value) return

  // Validation
  if (!fileName.value || !alt.value) {
    toast.error('Filename and alt text are required')
    return
  }

  if (!urlFile.value) {
    toast.error('File is required')
    return
  }

  loading.value = true

  // Créer FormData pour multipart
  const formData = new FormData()
  formData.append('fileName', fileName.value)
  formData.append('alt', alt.value)
  formData.append('caption', caption.value)
  formData.append('url', urlFile.value)

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/attachment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userStore.token || localStorage.getItem('token')}`,
        // NE PAS définir Content-Type, le navigateur le fait automatiquement
      },
      body: formData,
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || `HTTP ${res.status}`)
    }

    toast.success('Guide created successfully!')

    // Réinitialiser le formulaire
    fileName.value = ''
    alt.value = ''
    caption.value = ''
    urlFile.value = null

    // Réinitialiser l'input file
    const fileInput = document.getElementById('url') as HTMLInputElement
    if (fileInput) fileInput.value = ''

    // Rafraîchir la liste des attachments
    await userStore.fetchProfile()
    emit('navigate', 'list-attachments')
  } catch (err) {
    console.error(err)
    toast.error(err instanceof Error ? err.message : 'Failed to create attachment')
  } finally {
    loading.value = false
  }
}

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
}>()
</script>

<style scoped>
.create-attachment-form {
  background: var(--color-darker-charcoal);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 600px;
  margin: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}
.create-attachment-form h2 {
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
