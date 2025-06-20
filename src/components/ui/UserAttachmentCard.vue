<!-- src/components/ui/UserAttachmentCard.vue -->

<template>
  <article class="attachment-card">
    <!-- Header avec type et actions -->
    <div class="attachment-header">
      <div class="attachment-type-badge">
        <i :class="getAttachmentIcon(attachment.type)"></i>
        <span>{{ getAttachmentType(attachment.type) }}</span>
      </div>

      <div class="attachment-actions">
        <button
          @click="$emit('edit', attachment.id)"
          class="action-btn edit-btn"
          title="Edit attachment"
        >
          <i class="pi pi-pencil"></i>
        </button>
        <button
          @click="$emit('delete', attachment.id)"
          class="action-btn delete-btn"
          title="Delete attachment"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>

    <!-- Aperçu du fichier -->
    <div class="attachment-preview" @click="openPreview">
      <div class="preview-container">
        <!-- Aperçu image -->
        <img
          v-if="attachment.type === 'image'"
          :src="attachment.url"
          :alt="attachment.alt || attachment.fileName"
          class="preview-image"
          loading="lazy"
        />

        <!-- Aperçu document/vidéo -->
        <div v-else class="preview-placeholder">
          <i :class="getAttachmentIcon(attachment.type)"></i>
          <span class="file-extension">{{ getFileExtension(attachment.fileName) }}</span>
        </div>

        <!-- Overlay hover -->
        <div class="preview-overlay">
          <i class="pi pi-eye"></i>
          <span>Preview</span>
        </div>
      </div>
    </div>

    <!-- Informations du fichier -->
    <div class="attachment-info">
      <h3 class="attachment-title" :title="attachment.fileName">
        {{ attachment.fileName }}
      </h3>

      <p v-if="attachment.alt" class="attachment-alt" :title="attachment.alt">
        {{ attachment.alt }}
      </p>

      <p v-if="attachment.caption" class="attachment-caption" :title="attachment.caption">
        {{ attachment.caption }}
      </p>

      <!-- Métadonnées -->
      <div class="attachment-meta">
        <div class="meta-item">
          <i class="pi pi-calendar"></i>
          <span>{{ formatDate(attachment.createdAt) }}</span>
        </div>
        <div class="meta-item">
          <i class="pi pi-user"></i>
          <span>You</span>
        </div>
      </div>
    </div>

    <!-- Footer avec actions rapides -->
    <div class="attachment-footer">
      <button @click="copyUrl" class="footer-action" title="Copier l'URL">
        <i class="pi pi-copy"></i>
        <span>Copy URL</span>
      </button>

      <button @click="downloadFile" class="footer-action" title="Télécharger">
        <i class="pi pi-download"></i>
        <span>Download</span>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useToast } from 'vue-toast-notification'
import type { Attachment } from '@/types/collections'

const props = defineProps<{
  attachment: Attachment
}>()

defineEmits<{
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()

const toast = useToast()

// Fonction pour obtenir l'icône selon le type
function getAttachmentIcon(type: string): string {
  switch (type) {
    case 'image':
      return 'pi pi-image'
    case 'document':
      return 'pi pi-file-pdf'
    case 'video':
      return 'pi pi-video'
    default:
      return 'pi pi-file'
  }
}

// Fonction pour obtenir le libellé du type
function getAttachmentType(type: string): string {
  switch (type) {
    case 'image':
      return 'Image'
    case 'document':
      return 'Document'
    case 'video':
      return 'Vidéo'
    default:
      return 'Fichier'
  }
}

// Fonction pour extraire l'extension du fichier
function getFileExtension(fileName: string): string {
  const extension = fileName.split('.').pop()?.toUpperCase()
  return extension || 'FILE'
}

// Fonction pour formater la date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

// Fonction pour ouvrir l'aperçu
function openPreview() {
  window.open(props.attachment.url, '_blank')
}

// Fonction pour copier l'URL
async function copyUrl() {
  try {
    await navigator.clipboard.writeText(props.attachment.url)
    toast.success('URL copiée dans le presse-papiers')
  } catch {
    toast.error("Impossible de copier l'URL")
  }
}

// Fonction pour télécharger le fichier
function downloadFile() {
  const link = document.createElement('a')
  link.href = props.attachment.url
  link.download = props.attachment.fileName
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.attachment-card {
  background: var(--color-darker-charcoal);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.attachment-card:hover {
  border-color: var(--color-gold);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.15);
}

/* Header */
.attachment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-charcoal);
  border-bottom: 1px solid var(--color-medium-gray);
}

.attachment-type-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-gold);
  color: var(--color-charcoal);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: bold;
  text-transform: uppercase;
}

.attachment-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.action-btn {
  background: transparent;
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs);
  color: var(--color-cream);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.edit-btn:hover {
  background: var(--color-gold);
  color: var(--color-charcoal);
  border-color: var(--color-gold);
}

.delete-btn:hover {
  background: #e74c3c;
  color: var(--color-white);
  border-color: #e74c3c;
}

/* Aperçu */
.attachment-preview {
  position: relative;
  cursor: pointer;
  background: var(--color-dark-gray);
}

.preview-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-medium-gray);
}

.preview-placeholder i {
  font-size: 3rem;
  margin-bottom: var(--spacing-sm);
}

.file-extension {
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--color-gold);
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: var(--color-white);
}

.preview-overlay i {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

.attachment-preview:hover .preview-overlay {
  opacity: 1;
}

.attachment-preview:hover .preview-image {
  transform: scale(1.05);
}

/* Informations */
.attachment-info {
  padding: var(--spacing-md);
}

.attachment-title {
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  color: var(--color-gold);
  margin: 0 0 var(--spacing-sm) 0;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-alt {
  color: var(--color-cream);
  font-size: var(--font-size-sm);
  margin: 0 0 var(--spacing-xs) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-caption {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
  margin: 0 0 var(--spacing-md) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-style: italic;
}

.attachment-meta {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-medium-gray);
  font-size: var(--font-size-xs);
}

.meta-item i {
  font-size: var(--font-size-sm);
}

/* Footer */
.attachment-footer {
  display: flex;
  border-top: 1px solid var(--color-medium-gray);
  background: var(--color-charcoal);
}

.footer-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: transparent;
  border: none;
  color: var(--color-cream);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--font-size-sm);
  font-family: var(--font-secondary);
}

.footer-action:hover {
  background: var(--color-gold);
  color: var(--color-charcoal);
}

.footer-action:not(:last-child) {
  border-right: 1px solid var(--color-medium-gray);
}

/* Responsive */
@media (max-width: 768px) {
  .attachment-header {
    padding: var(--spacing-sm);
  }

  .attachment-info {
    padding: var(--spacing-sm);
  }

  .attachment-meta {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .footer-action {
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
  }

  .footer-action span {
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 480px) {
  .preview-container {
    height: 150px;
  }

  .attachment-type-badge {
    font-size: var(--font-size-xs);
    padding: 2px var(--spacing-xs);
  }

  .action-btn {
    width: 28px;
    height: 28px;
  }

  .preview-placeholder i {
    font-size: 2rem;
  }
}
</style>
