<!-- src/components/ui/UpdateAttachmentForm.vue -->

<template>
  <form @submit.prevent="submit" class="update-attachment-form">
    <h2>Edit Attachment</h2>

    <!-- Url -->
    <div class="field">
      <label for="url">File</label>

      <!-- Image -->
      <div class="url-preview-wrapper" @click="triggerFileInput">
        <!-- Aperçu pour les images -->
        <img
          v-if="urlPreview && isImageFile(props.attachment.url || urlPreview)"
          :src="urlPreview"
          alt="File Preview"
          class="url-preview-img"
        />

        <!-- Aperçu pour les autres types de fichiers -->
        <div v-else-if="urlPreview" class="file-preview">
          <i :class="getFileIcon(props.attachment.fileName || '')"></i>
          <span class="file-name">{{ getFileName(props.attachment.fileName || '') }}</span>
          <small class="file-type">{{ getFileExtension(props.attachment.fileName || '') }}</small>
        </div>

        <!-- Placeholder par défaut -->
        <div v-else class="url-placeholder">
          <i class="pi pi-cloud-upload"></i>
          <span>Cliquez pour changer le fichier</span>
        </div>
      </div>

      <!-- Input file (caché) -->
      <input
        id="url"
        type="file"
        accept="image/webp,image/png,image/jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,video/mp4,video/webm"
        @change="handleFileChange"
        class="file-input"
      />

      <p class="file-hint">
        Accepted formats: WEBP, PNG, JPEG, PDF, DOC, DOCX, TXT, MP4, WEBM (max 10MB)
      </p>
    </div>

    <!-- Filename -->
    <div class="field">
      <label for="fileName">Filename</label>

      <input id="fileName" v-model="fileName" type="text" required />
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

    <!-- Boutons -->
    <div class="actions-row">
      <SubmitButton
        class="mr"
        label="Cancel"
        icon="pi-times-circle"
        iconPosition="left"
        variant="secondary"
        @click.prevent="emit('navigate', 'list-attachments')"
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
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'
import SubmitButton from './SubmitButton.vue'
import type { Attachment } from '@/types/collections'
import { defineProps } from 'vue'
const toast = useToast()
const userStore = useUserStore()
const props = defineProps<{
  attachment: Attachment
}>()
const loading = ref(false)
const fileName = ref(props.attachment.fileName)
const alt = ref(props.attachment.alt)
const caption = ref(props.attachment.caption)
const coverFile = ref<File | null>(null)

// Fonction pour vérifier si c'est une image
function isImageFile(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  return imageExtensions.some((ext) => url.toLowerCase().includes(ext))
}

// Fonction pour obtenir l'icône selon le type de fichier
function getFileIcon(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'pdf':
      return 'pi pi-file-pdf'
    case 'doc':
    case 'docx':
      return 'pi pi-file-word'
    case 'txt':
      return 'pi pi-file'
    case 'mp4':
    case 'webm':
    case 'avi':
      return 'pi pi-video'
    default:
      return 'pi pi-file'
  }
}

// Fonction pour obtenir le nom du fichier sans extension
function getFileName(fileName: string): string {
  return fileName.split('.').slice(0, -1).join('.')
}

// Fonction pour obtenir l'extension du fichier
function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toUpperCase() || 'FILE'
}

// On s'assure d'avoir la liste complète des steps de l'utilisateur
onMounted(async () => {
  urlPreview.value = props.attachment.url || null
})

// URL de prévisualisation de la couverture
const urlPreview = ref<string | null>(null)

// Gestion de l'image
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Validation taille et type
  if (file.size > 10 * 1024 * 1024) {
    toast.error('The size must be < 10 MB.')
    return
  }

  const validTypes = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg']

  if (!validTypes.includes(file.type)) {
    toast.error('Invalide format (WEBP, PNG, JPEG).')

    return
  }

  // Enregistrer le fichier sélectionné
  coverFile.value = file

  // Générer une URL locale pour affichage de prévisualisation
  urlPreview.value = URL.createObjectURL(file)
}

// Changement de l'image

function triggerFileInput() {
  const fileInput = document.getElementById('url') as HTMLInputElement
  fileInput?.click()
}

async function submit() {
  loading.value = true
  try {
    // Créer FormData pour support multipart si fichier présent
    if (coverFile.value) {
      const formData = new FormData()
      formData.append('fileName', fileName.value)
      formData.append('alt', alt.value)
      formData.append('caption', caption.value)
      formData.append('url', coverFile.value)

      await fetch(
        `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/attachment/${props.attachment.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
          body: formData,
        },
      )
    } else {
      // Mise à jour des champs texte seulement
      await fetch(
        `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/attachment/${props.attachment.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.token}`,
          },
          body: JSON.stringify({
            fileName: fileName.value,
            alt: alt.value,
            caption: caption.value,
          }),
        },
      )
    }

    // Mettre à jour le store local
    const idx = userStore.attachmentsCreated.findIndex((a) => a.id === props.attachment.id)
    if (idx !== -1) {
      userStore.attachmentsCreated[idx] = {
        ...userStore.attachmentsCreated[idx],
        fileName: fileName.value,
        alt: alt.value,
        caption: caption.value,
      }
    }

    await userStore.fetchUserAttachments()
    toast.success('Attachment updated successfully!')
    emit('navigate', 'list-attachments')
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
.update-attachment-form {
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

.url-preview-wrapper {
  width: 100%;
  max-width: 400px;
  height: 200px;
  border: 2px dashed var(--color-medium-gray);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  background: var(--color-dark-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin: var(--spacing-sm) 0;
}

.url-preview-wrapper:hover {
  border-color: var(--color-gold);
  background: var(--color-charcoal);
}

.url-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.url-preview-wrapper:hover .url-preview-img {
  transform: scale(1.05);
}

.url-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-medium-gray);
  text-align: center;
  padding: var(--spacing-md);
}

.url-placeholder i {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-sm);
  color: var(--color-gold);
}

.url-placeholder span {
  font-size: var(--font-size-sm);
  font-family: var(--font-secondary);
}

/* Input file caché */
.file-input {
  display: none;
}

/* Hint text */
.file-hint {
  font-size: var(--font-size-xs);
  color: var(--color-medium-gray);
  margin-top: var(--spacing-xs);
  text-align: center;
}

@media (max-width: 768px) {
  .url-preview-wrapper {
    max-width: 100%;
    height: 150px;
  }
}

@media (max-width: 480px) {
  .url-preview-wrapper {
    height: 120px;
  }

  .url-placeholder i {
    font-size: 2rem;
  }

  .url-placeholder span {
    font-size: var(--font-size-xs);
  }
}
</style>
