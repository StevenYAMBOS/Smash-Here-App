<!-- src/components/ContactForm.vue -->

<template>
  <form @submit.prevent="submitForm" class="contact-form">
    <div class="form-header">
      <h2>
        <i class="pi pi-envelope"></i>
        Contact Support
      </h2>
      <p>We're here to help! Send us a message and we'll get back to you as soon as possible.</p>
    </div>

    <!-- User Info Section (if not logged in) -->
    <div v-if="!isLoggedIn" class="form-section">
      <h3>
        <i class="pi pi-user"></i>
        Your Information
      </h3>

      <div class="form-group">
        <label for="email" class="required">Email Address</label>
        <div class="input-wrapper">
          <i class="pi pi-envelope input-icon"></i>
          <input
            id="email"
            type="email"
            v-model="formData.email"
            placeholder="your.email@example.com"
            :class="{ error: errors.email }"
            required
          />
        </div>
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <!-- <div class="form-group">
        <label for="name">Full Name (Optional)</label>
        <div class="input-wrapper">
          <i class="pi pi-user input-icon"></i>
          <input id="name" type="text" v-model="formData.name" placeholder="John Doe" />
        </div>
      </div> -->
    </div>

    <!-- Contact Reason -->
    <div class="form-section">
      <h3>
        <i class="pi pi-question-circle"></i>
        What can we help you with?
      </h3>

      <div class="form-group">
        <label for="category" class="required">Category</label>
        <div class="select-wrapper">
          <select
            id="category"
            v-model="formData.category"
            :class="{ error: errors.category }"
            required
            @change="updateSubjectSuggestions"
          >
            <option value="">Select a category</option>
            <option value="technical">Technical Support</option>
            <option value="account">Account Issues</option>
            <option value="roadmap">Roadmap/Content Issues</option>
            <option value="billing">Billing & Subscriptions</option>
            <option value="feature">Feature Request</option>
            <option value="bug">Bug Report</option>
            <option value="other">Other</option>
          </select>
          <i class="pi pi-chevron-down select-icon"></i>
        </div>
        <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
      </div>

      <div class="form-group">
        <label for="priority">Priority Level</label>
        <div class="priority-buttons">
          <button
            type="button"
            v-for="priority in priorities"
            :key="priority.value"
            @click="formData.priority = priority.value"
            :class="[
              'priority-btn',
              priority.value,
              { active: formData.priority === priority.value },
            ]"
          >
            <i :class="priority.icon"></i>
            {{ priority.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Message Details -->
    <div class="form-section">
      <h3>
        <i class="pi pi-comment"></i>
        Message Details
      </h3>

      <div class="form-group">
        <label for="subject" class="required">Subject</label>
        <div class="input-wrapper">
          <i class="pi pi-tag input-icon"></i>
          <input
            id="subject"
            type="text"
            v-model="formData.subject"
            :placeholder="subjectPlaceholder"
            :class="{ error: errors.subject }"
            required
            maxlength="100"
          />
        </div>
        <div class="char-count">{{ formData.subject.length }}/100</div>
        <span v-if="errors.subject" class="error-message">{{ errors.subject }}</span>
      </div>

      <div class="form-group">
        <label for="message" class="required">Message</label>
        <textarea
          id="message"
          v-model="formData.message"
          placeholder="Please describe your issue or question in detail. Include any relevant information that might help us assist you better."
          :class="{ error: errors.message }"
          required
          rows="6"
          maxlength="2000"
        ></textarea>
        <div class="char-count">{{ formData.message.length }}/2000</div>
        <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
      </div>
    </div>

    <!-- File Attachment -->
    <div class="form-section">
      <h3>
        <i class="pi pi-paperclip"></i>
        Attachment (Optional)
      </h3>
      <p class="section-description">
        Upload a screenshot or image to help us understand your issue better.
      </p>

      <div class="form-group">
        <div
          class="file-upload-area"
          :class="{ dragover: isDragging, 'has-file': formData.image }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleFileDrop"
          @click="triggerFileInput"
        >
          <input
            ref="fileInput"
            type="file"
            accept=".png,.jpg,.jpeg"
            @change="handleFileSelect"
            class="file-input"
          />

          <div v-if="!formData.image" class="upload-prompt">
            <i class="pi pi-cloud-upload upload-icon"></i>
            <p><strong>Click to upload</strong> or drag and drop</p>
            <p class="file-restrictions">PNG, JPG up to 5MB</p>
          </div>

          <div v-else class="file-preview">
            <img :src="imagePreview" alt="Preview" class="preview-image" />
            <div class="file-info">
              <p class="file-name">{{ formData.image.name }}</p>
              <p class="file-size">{{ formatFileSize(formData.image.size) }}</p>
            </div>
            <button type="button" @click.stop="removeFile" class="remove-file-btn">
              <i class="pi pi-times"></i>
            </button>
          </div>
        </div>
        <span v-if="errors.image" class="error-message">{{ errors.image }}</span>
      </div>
    </div>

    <!-- System Information (Auto-collected) -->
    <div class="form-section">
      <h3>
        <i class="pi pi-desktop"></i>
        System Information
      </h3>
      <p class="section-description">This information helps us provide better support.</p>

      <div class="system-info">
        <div class="info-item">
          <span class="info-label">Browser:</span>
          <span class="info-value">{{ systemInfo.browser }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Operating System:</span>
          <span class="info-value">{{ systemInfo.os }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Screen Resolution:</span>
          <span class="info-value">{{ systemInfo.resolution }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Timestamp:</span>
          <span class="info-value">{{ currentTimestamp }}</span>
        </div>
      </div>
    </div>

    <!-- Privacy Notice -->
    <div class="privacy-notice">
      <div class="checkbox-wrapper">
        <input
          id="privacy"
          type="checkbox"
          v-model="formData.agreeToPrivacy"
          :class="{ error: errors.privacy }"
          required
        />
        <label for="privacy">
          I agree to the processing of my personal data according to the
          <a href="/privacy" target="_blank">Privacy Policy</a>
        </label>
      </div>
      <span v-if="errors.privacy" class="error-message">{{ errors.privacy }}</span>
    </div>

    <!-- Submit Button -->
    <div class="form-actions">
      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        <i v-if="!isSubmitting" class="pi pi-send"></i>
        <i v-else class="pi pi-spin pi-spinner"></i>
        {{ isSubmitting ? 'Sending...' : 'Send Message' }}
      </button>
    </div>

    <!-- Success Message -->
    <div v-if="showSuccess" class="success-message">
      <i class="pi pi-check-circle"></i>
      <div>
        <h4>Message Sent Successfully!</h4>
        <p>We've received your message and will get back to you within 24 hours.</p>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'

// Composables et états
const toast = useToast()
const fileInput = ref<HTMLInputElement | null>(null)
const isSubmitting = ref(false)
const showSuccess = ref(false)
const isDragging = ref(false)
const imagePreview = ref<string | null>(null)

// Simuler l'état de connexion (à remplacer par votre store)
const isLoggedIn = ref(false) // À connecter avec votre user store

// Données du formulaire
const formData = reactive({
  email: '',
  name: '',
  category: '',
  priority: 'medium',
  subject: '',
  message: '',
  image: null as File | null,
  agreeToPrivacy: false,
})

// Gestion des erreurs
const errors = reactive({
  email: '',
  category: '',
  subject: '',
  message: '',
  image: '',
  privacy: '',
})

// Options de priorité
const priorities = [
  { value: 'low', label: 'Low', icon: 'pi pi-minus-circle' },
  { value: 'medium', label: 'Medium', icon: 'pi pi-circle' },
  { value: 'high', label: 'High', icon: 'pi pi-exclamation-circle' },
  { value: 'urgent', label: 'Urgent', icon: 'pi pi-exclamation-triangle' },
]

// Suggestions de sujets selon la catégorie
const subjectSuggestions: Record<string, string> = {
  technical: 'Technical issue with...',
  account: 'Account problem with...',
  roadmap: 'Roadmap issue with...',
  billing: 'Billing question about...',
  feature: 'Feature request for...',
  bug: 'Bug report: ...',
  other: 'Question about...',
}

// Placeholder dynamique pour le sujet
const subjectPlaceholder = computed(() => {
  return subjectSuggestions[formData.category] || 'Describe your issue briefly'
})

// Information système
const systemInfo = reactive({
  browser: '',
  os: '',
  resolution: '',
})

// Timestamp actuel
const currentTimestamp = computed(() => {
  return new Date().toLocaleString()
})

// Méthodes
function updateSubjectSuggestions() {
  if (formData.category && !formData.subject) {
    // Optionnellement pré-remplir le sujet
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    validateAndSetFile(file)
  }
}

function handleFileDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

function validateAndSetFile(file: File) {
  errors.image = ''

  // Vérifier le type de fichier
  const validTypes = ['image/png', 'image/jpg', 'image/jpeg']
  if (!validTypes.includes(file.type)) {
    errors.image = 'Only PNG and JPG files are allowed'
    return
  }

  // Vérifier la taille (5MB max)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    errors.image = 'File size must be less than 5MB'
    return
  }

  formData.image = file

  // Créer un aperçu
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function removeFile() {
  formData.image = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function validateForm(): boolean {
  // Reset des erreurs
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Validation email (si pas connecté)
  if (!isLoggedIn.value && !formData.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!isLoggedIn.value && !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Validation catégorie
  if (!formData.category) {
    errors.category = 'Please select a category'
    isValid = false
  }

  // Validation sujet
  if (!formData.subject.trim()) {
    errors.subject = 'Subject is required'
    isValid = false
  } else if (formData.subject.length < 5) {
    errors.subject = 'Subject must be at least 5 characters'
    isValid = false
  }

  // Validation message
  if (!formData.message.trim()) {
    errors.message = 'Message is required'
    isValid = false
  } else if (formData.message.length < 20) {
    errors.message = 'Message must be at least 20 characters'
    isValid = false
  }

  // Validation confidentialité
  if (!formData.agreeToPrivacy) {
    errors.privacy = 'You must agree to the privacy policy'
    isValid = false
  }

  return isValid
}

async function submitForm() {
  if (!validateForm() || isSubmitting.value) return

  isSubmitting.value = true

  try {
    const formDataToSend = new FormData()

    // Ajouter les champs texte
    if (!isLoggedIn.value) {
      formDataToSend.append('email', formData.email)
      formDataToSend.append('name', formData.name)
    }
    formDataToSend.append('category', formData.category)
    formDataToSend.append('priority', formData.priority)
    formDataToSend.append('subject', formData.subject)
    formDataToSend.append('message', formData.message)

    // Ajouter les informations système
    formDataToSend.append('systemInfo', JSON.stringify(systemInfo))
    formDataToSend.append('timestamp', currentTimestamp.value)

    // Ajouter l'image si présente
    if (formData.image) {
      formDataToSend.append('image', formData.image)
    }

    const response = await fetch('http://localhost:3000/contact', {
      method: 'POST',
      body: formDataToSend,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Succès
    showSuccess.value = true
    toast.success('Message sent successfully!')

    // Reset du formulaire après 3 secondes
    setTimeout(() => {
      resetForm()
    }, 3000)
  } catch (error) {
    console.error('Error sending message:', error)
    toast.error('Failed to send message. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  Object.keys(formData).forEach((key) => {
    if (key === 'priority') {
      formData[key as keyof typeof formData] = 'medium'
    } else if (key === 'agreeToPrivacy') {
      formData[key as keyof typeof formData] = false
    } else if (key === 'image') {
      formData[key as keyof typeof formData] = null
    } else {
      formData[key as keyof typeof formData] = ''
    }
  })

  removeFile()
  showSuccess.value = false
}

function detectSystemInfo() {
  // Détecter le navigateur
  const userAgent = navigator.userAgent
  if (userAgent.includes('Chrome')) systemInfo.browser = 'Chrome'
  else if (userAgent.includes('Firefox')) systemInfo.browser = 'Firefox'
  else if (userAgent.includes('Safari')) systemInfo.browser = 'Safari'
  else if (userAgent.includes('Edge')) systemInfo.browser = 'Edge'
  else systemInfo.browser = 'Unknown'

  // Détecter l'OS
  if (userAgent.includes('Windows')) systemInfo.os = 'Windows'
  else if (userAgent.includes('Mac')) systemInfo.os = 'macOS'
  else if (userAgent.includes('Linux')) systemInfo.os = 'Linux'
  else if (userAgent.includes('Android')) systemInfo.os = 'Android'
  else if (userAgent.includes('iOS')) systemInfo.os = 'iOS'
  else systemInfo.os = 'Unknown'

  // Résolution d'écran
  systemInfo.resolution = `${screen.width}x${screen.height}`
}

onMounted(() => {
  detectSystemInfo()
})
</script>

<style scoped>
.contact-form {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  background: var(--color-darker-charcoal);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-medium-gray);
}

/* Header */
.form-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.form-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-3xl);
  color: var(--color-gold);
  margin-bottom: var(--spacing-md);
}

.form-header p {
  color: var(--color-light-gray);
  font-size: var(--font-size-lg);
}

/* Form Sections */
.form-section {
  margin-bottom: var(--spacing-3xl);
  padding: var(--spacing-xl);
  background: var(--color-charcoal);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-medium-gray);
}

.form-section h3 {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-xl);
  color: var(--color-gold);
  margin-bottom: var(--spacing-lg);
}

.section-description {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-lg);
}

/* Form Groups */
.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  font-family: var(--font-secondary);
  font-weight: 600;
  color: var(--color-cream);
  margin-bottom: var(--spacing-sm);
}

label.required::after {
  content: ' *';
  color: var(--color-gold);
}

/* Input Styles */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: var(--spacing-md);
  color: var(--color-medium-gray);
  z-index: 1;
}

input,
textarea {
  width: 100%;
  padding: var(--spacing-md);
  padding-left: var(--spacing-3xl);
  background: var(--color-dark-gray);
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-gold);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}

input.error,
textarea.error {
  border-color: #ff6b6b;
}

textarea {
  padding-left: var(--spacing-md);
  resize: vertical;
  min-height: 120px;
}

/* Select Styles */
.select-wrapper {
  position: relative;
}

select {
  width: 100%;
  padding: var(--spacing-md);
  background: var(--color-dark-gray);
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  appearance: none;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

select:focus {
  outline: none;
  border-color: var(--color-gold);
}

.select-icon {
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-medium-gray);
  pointer-events: none;
}

/* Priority Buttons */
.priority-buttons {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.priority-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-dark-gray);
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.priority-btn:hover {
  border-color: var(--color-gold);
}

.priority-btn.active {
  background: var(--color-gold);
  color: var(--color-charcoal);
  border-color: var(--color-gold);
}

.priority-btn.low.active {
  background: #4caf50;
  border-color: #4caf50;
}
.priority-btn.medium.active {
  background: var(--color-orange);
  border-color: var(--color-orange);
}
.priority-btn.high.active {
  background: #ff9800;
  border-color: #ff9800;
}
.priority-btn.urgent.active {
  background: #f44336;
  border-color: #f44336;
}

/* File Upload */
.file-upload-area {
  border: 2px dashed var(--color-medium-gray);
  border-radius: var(--radius-md);
  padding: var(--spacing-3xl);
  text-align: center;
  background: var(--color-dark-gray);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.file-upload-area:hover,
.file-upload-area.dragover {
  border-color: var(--color-gold);
  background: rgba(255, 215, 0, 0.05);
}

.file-upload-area.has-file {
  border-style: solid;
  border-color: var(--color-gold);
}

.file-input {
  display: none;
}

.upload-prompt {
  color: var(--color-cream);
}

.upload-icon {
  font-size: var(--font-size-4xl);
  color: var(--color-gold);
  margin-bottom: var(--spacing-md);
}

.file-restrictions {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-sm);
}

/* File Preview */
.file-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  text-align: left;
}

.preview-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 2px solid var(--color-gold);
}

.file-info {
  flex: 1;
}

.file-name {
  color: var(--color-cream);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.file-size {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
}

.remove-file-btn {
  background: #ff6b6b;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.remove-file-btn:hover {
  background: #ff5252;
}

/* System Info */
.system-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm);
  background: var(--color-dark-gray);
  border-radius: var(--radius-sm);
}

.info-label {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
}

.info-value {
  color: var(--color-cream);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

/* Character Count */
.char-count {
  text-align: right;
  color: var(--color-light-gray);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-xs);
}

/* Privacy Notice */
.privacy-notice {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-charcoal);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-medium-gray);
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.checkbox-wrapper input[type='checkbox'] {
  width: auto;
  margin: 0;
  padding: 0;
}

.checkbox-wrapper label {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
  margin: 0;
}

.checkbox-wrapper a {
  color: var(--color-gold);
  text-decoration: none;
}

.checkbox-wrapper a:hover {
  text-decoration: underline;
}

/* Error Messages */
.error-message {
  display: block;
  color: #ff6b6b;
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

/* Submit Button */
.form-actions {
  text-align: center;
  margin-top: var(--spacing-xl);
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-3xl);
  background: var(--color-gold);
  color: var(--color-charcoal);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #ffed4e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Success Message */
.success-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: linear-gradient(135deg, #4caf50, #45a049);
  border-radius: var(--radius-md);
  color: white;
  margin-top: var(--spacing-xl);
  border: 1px solid #4caf50;
}

.success-message i {
  font-size: var(--font-size-2xl);
  color: white;
}

.success-message h4 {
  margin: 0 0 var(--spacing-xs) 0;
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
}

.success-message p {
  margin: 0;
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-form {
    padding: var(--spacing-lg);
  }

  .form-header h2 {
    font-size: var(--font-size-2xl);
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .form-section {
    padding: var(--spacing-lg);
  }

  .priority-buttons {
    grid-template-columns: repeat(2, 1fr);
  }

  .system-info {
    grid-template-columns: 1fr;
  }

  .file-preview {
    flex-direction: column;
    text-align: center;
  }

  .success-message {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .form-header h2 {
    font-size: var(--font-size-xl);
  }

  .priority-buttons {
    grid-template-columns: 1fr;
  }

  .checkbox-wrapper {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .submit-btn {
    width: 100%;
    padding: var(--spacing-lg);
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-message {
  animation: fadeIn 0.5s ease-out;
}

.form-section {
  animation: fadeIn 0.3s ease-out;
}

/* Focus States */
input:focus + .input-icon,
textarea:focus + .input-icon {
  color: var(--color-gold);
}

/* Placeholder Styles */
input::placeholder,
textarea::placeholder {
  color: var(--color-medium-gray);
  opacity: 0.8;
}

/* Loading Spinner */
.pi-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
