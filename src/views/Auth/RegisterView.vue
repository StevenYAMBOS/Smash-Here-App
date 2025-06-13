<!-- src/views/Auth/RegisterView.vue -->

<template>
  <div class="auth-container">
    <div class="auth-background">
      <div class="bg-pattern"></div>
      <div class="bg-glow"></div>
    </div>

    <div class="auth-box">
      <!-- Header Section -->
      <div class="auth-header">
        <div class="logo-section">
          <i class="pi pi-trophy logo-icon"></i>
          <h1 class="auth-title">Join the Arena</h1>
        </div>
        <p class="auth-subtitle">Create your account and start your journey to mastery</p>
      </div>

      <!-- Progress Indicator -->
      <div class="progress-indicator">
        <div
          class="progress-step"
          :class="{ active: currentStep >= 1, completed: currentStep > 1 }"
        >
          <i class="pi pi-user"></i>
          <span>Account</span>
        </div>
        <div class="progress-line" :class="{ active: currentStep > 1 }"></div>
        <div
          class="progress-step"
          :class="{ active: currentStep >= 2, completed: currentStep > 2 }"
        >
          <i class="pi pi-image"></i>
          <span>Avatar</span>
        </div>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="auth-form" enctype="multipart/form-data">
        <!-- Step 1: Account Information -->
        <div v-if="currentStep === 1" class="form-step">
          <!-- Username Field -->
          <div class="input-group">
            <label for="username" class="input-label">
              <i class="pi pi-user"></i>
              Username
            </label>
            <div class="input-wrapper">
              <input
                id="username"
                type="text"
                v-model="username"
                placeholder="Choose your gamer tag"
                :class="{ 'input-error': usernameError }"
                required
                @blur="validateUsername"
                @input="clearUsernameError"
              />
              <!-- <i class="pi pi-user input-icon"></i> -->
              <div class="availability-indicator" v-if="username">
                <i class="pi pi-check" v-if="usernameAvailable"></i>
                <i class="pi pi-times" v-else></i>
              </div>
            </div>
            <span v-if="usernameError" class="error-message">{{ usernameError }}</span>
            <span v-else-if="username && usernameAvailable" class="success-message"
              >Username is available!</span
            >
          </div>

          <!-- Email Field -->
          <div class="input-group">
            <label for="email" class="input-label">
              <i class="pi pi-envelope"></i>
              Email Address
            </label>
            <div class="input-wrapper">
              <input
                id="email"
                type="email"
                v-model="email"
                placeholder="Enter your email"
                :class="{ 'input-error': emailError }"
                required
                @blur="validateEmail"
                @input="clearEmailError"
              />
              <!-- <i class="pi pi-envelope input-icon"></i> -->
            </div>
            <span v-if="emailError" class="error-message">{{ emailError }}</span>
          </div>

          <!-- Password Field -->
          <div class="input-group">
            <label for="password" class="input-label">
              <i class="pi pi-lock"></i>
              Password
            </label>
            <div class="input-wrapper">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Create a strong password"
                :class="{ 'input-error': passwordError }"
                required
                @blur="validatePassword"
                @input="clearPasswordError"
              />
              <!-- <i class="pi pi-lock input-icon"></i> -->
              <button type="button" @click="togglePassword" class="password-toggle">
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
            <span v-if="passwordError" class="error-message">{{ passwordError }}</span>

            <!-- Password Strength Indicator -->
            <div class="password-strength">
              <div class="strength-bar">
                <div
                  class="strength-fill"
                  :class="passwordStrength.class"
                  :style="{ width: passwordStrength.width }"
                ></div>
              </div>
              <span class="strength-text">{{ passwordStrength.text }}</span>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="input-group">
            <label for="confirmPassword" class="input-label">
              <i class="pi pi-shield"></i>
              Confirm Password
            </label>
            <div class="input-wrapper">
              <input
                id="confirmPassword"
                type="password"
                v-model="confirmPassword"
                placeholder="Confirm your password"
                :class="{ 'input-error': confirmPasswordError }"
                required
                @blur="validateConfirmPassword"
                @input="clearConfirmPasswordError"
              />
              <!-- <i class="pi pi-shield input-icon"></i> -->
            </div>
            <span v-if="confirmPasswordError" class="error-message">{{
              confirmPasswordError
            }}</span>
          </div>
        </div>

        <!-- Step 2: Profile Picture -->
        <div v-if="currentStep === 2" class="form-step">
          <div class="profile-section">
            <h3 class="section-title">
              <i class="pi pi-image"></i>
              Choose Your Avatar
            </h3>
            <p class="section-description">Upload a profile picture to personalize your account</p>

            <!-- Avatar Upload -->
            <div class="avatar-upload-container">
              <div
                class="avatar-upload-area"
                :class="{ dragover: isDragging, 'has-image': file || avatarPreview }"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
              >
                <input
                  ref="fileInput"
                  id="profilePicture"
                  type="file"
                  @change="onFileChange"
                  accept="image/*"
                  class="file-input"
                  required
                />

                <div v-if="!file && !avatarPreview" class="upload-prompt">
                  <i class="pi pi-cloud-upload upload-icon"></i>
                  <h4>Drop your image here</h4>
                  <p>or <span class="upload-link">click to browse</span></p>
                  <span class="file-requirements">PNG, JPG up to 5MB</span>
                </div>

                <div v-else class="avatar-preview">
                  <img :src="avatarPreview" alt="Profile Preview" class="preview-image" />
                  <div class="avatar-overlay">
                    <button type="button" @click.stop="removeFile" class="remove-avatar-btn">
                      <i class="pi pi-times"></i>
                    </button>
                    <button type="button" @click.stop="triggerFileInput" class="change-avatar-btn">
                      <i class="pi pi-pencil"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Terms and Privacy -->
        <div class="terms-section">
          <label class="terms-checkbox">
            <input type="checkbox" v-model="agreeToTerms" required />
            <span class="checkmark"></span>
            <span class="terms-text">
              I agree to the
              <a href="/terms" target="_blank">Terms of Service</a>
              and
              <a href="/privacy" target="_blank">Privacy Policy</a>
            </span>
          </label>
        </div>

        <!-- Form Navigation -->
        <div class="form-navigation">
          <button
            v-if="currentStep > 1"
            type="button"
            @click="previousStep"
            class="nav-button secondary"
          >
            <i class="pi pi-arrow-left"></i>
            Back
          </button>

          <button
            v-if="currentStep < 2"
            type="button"
            @click="nextStep"
            :disabled="!canProceed"
            class="nav-button primary"
          >
            Continue
            <i class="pi pi-arrow-right"></i>
          </button>

          <button
            v-if="currentStep === 2"
            type="submit"
            :disabled="loading || !canSubmit"
            class="submit-button"
          >
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-user-plus"></i>
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </div>

        <!-- Divider -->
        <!-- <div class="divider">
          <span>or</span>
        </div> -->

        <!-- Social Registration -->
        <!-- <div class="social-login">
          <button type="button" class="social-btn discord">
            <i class="pi pi-discord"></i>
            Sign up with Discord
          </button>
          <button type="button" class="social-btn twitter">
            <i class="pi pi-twitter"></i>
            Sign up with Twitter
          </button>
        </div> -->

        <!-- Login Link -->
        <div class="auth-footer">
          <p class="auth-link">
            Already have an account?
            <router-link to="/auth/login" class="login-link">
              Sign In
              <i class="pi pi-arrow-right"></i>
            </router-link>
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-banner">
          <i class="pi pi-exclamation-triangle"></i>
          <span>{{ error }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const toast = useToast()
const fileInput = ref<HTMLInputElement | null>(null)

// Form data
const currentStep = ref(1)
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const file = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const agreeToTerms = ref(false)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const isDragging = ref(false)

// Validation states
const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const usernameAvailable = ref(true)

// Computed properties
const passwordStrength = computed(() => {
  const pass = password.value
  if (!pass) return { class: '', width: '0%', text: '' }

  let score = 0
  const feedback = []

  if (pass.length >= 8) score++
  else feedback.push('8+ characters')

  if (/[A-Z]/.test(pass)) score++
  else feedback.push('uppercase')

  if (/[a-z]/.test(pass)) score++
  else feedback.push('lowercase')

  if (/\d/.test(pass)) score++
  else feedback.push('number')

  if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++
  else feedback.push('special character')

  const strength = {
    0: { class: 'very-weak', width: '20%', text: 'Very Weak' },
    1: { class: 'weak', width: '40%', text: 'Weak' },
    2: { class: 'fair', width: '60%', text: 'Fair' },
    3: { class: 'good', width: '80%', text: 'Good' },
    4: { class: 'strong', width: '100%', text: 'Strong' },
    5: { class: 'very-strong', width: '100%', text: 'Very Strong' },
  }

  return strength[score] || strength[0]
})

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return (
      username.value &&
      email.value &&
      password.value &&
      confirmPassword.value &&
      !usernameError.value &&
      !emailError.value &&
      !passwordError.value &&
      !confirmPasswordError.value
    )
  }
  return true
})

const canSubmit = computed(() => {
  return canProceed.value && file.value && agreeToTerms.value
})

// Methods
function togglePassword() {
  showPassword.value = !showPassword.value
}

function validateUsername() {
  if (!username.value) {
    usernameError.value = 'Username is required'
  } else if (username.value.length < 3) {
    usernameError.value = 'Username must be at least 3 characters'
  } else if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
    usernameError.value = 'Username can only contain letters, numbers, and underscores'
  } else {
    usernameError.value = ''
    // TODO: Check username availability via API
    usernameAvailable.value = true
  }
}

function validateEmail() {
  if (!email.value) {
    emailError.value = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    emailError.value = 'Please enter a valid email'
  } else {
    emailError.value = ''
  }
}

function validatePassword() {
  if (!password.value) {
    passwordError.value = 'Password is required'
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
  } else {
    passwordError.value = ''
  }
}

function validateConfirmPassword() {
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your password'
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
  } else {
    confirmPasswordError.value = ''
  }
}

function clearUsernameError() {
  usernameError.value = ''
}
function clearEmailError() {
  emailError.value = ''
}
function clearPasswordError() {
  passwordError.value = ''
}
function clearConfirmPasswordError() {
  confirmPasswordError.value = ''
}

function nextStep() {
  if (currentStep.value === 1) {
    validateUsername()
    validateEmail()
    validatePassword()
    validateConfirmPassword()

    if (canProceed.value) {
      currentStep.value = 2
    }
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const selectedFile = input.files?.[0]
  if (selectedFile) {
    validateAndSetFile(selectedFile)
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const droppedFile = e.dataTransfer?.files[0]
  if (droppedFile) {
    validateAndSetFile(droppedFile)
  }
}

function validateAndSetFile(selectedFile: File) {
  // Validate file type
  if (!selectedFile.type.startsWith('image/')) {
    toast.error('Please select an image file')
    return
  }

  // Validate file size (5MB)
  if (selectedFile.size > 5 * 1024 * 1024) {
    toast.error('File size must be less than 5MB')
    return
  }

  file.value = selectedFile

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(selectedFile)
}

function removeFile() {
  file.value = null
  avatarPreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function handleRegister() {
  if (!canSubmit.value) {
    toast.warning('Please complete all required fields.')
    return
  }

  loading.value = true
  error.value = ''

  const form = new FormData()
  form.append('username', username.value)
  form.append('email', email.value)
  form.append('password', password.value)
  if (file.value) {
    form.append('profilePicture', file.value)
  }

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/auth/register`,
      { method: 'POST', body: form },
    )

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || `HTTP ${res.status}`)
    }

    toast.success('🎉 Welcome to Smash Here! Please sign in to continue.')
    router.push('/auth/login')
  } catch (err: any) {
    const errorMessage = err.message || 'Registration failed. Please try again.'
    toast.error(errorMessage)
    error.value = errorMessage
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  position: relative;
  /* min-height: 100vh;
  background: linear-gradient(135deg, var(--color-darker-charcoal), var(--color-charcoal)); */
}

/* Background Effects */
.auth-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 166, 0, 0.1) 0%, transparent 50%);
  animation: pulse 4s ease-in-out infinite;
}

.bg-glow {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(255, 215, 0, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

/* Auth Box */
.auth-box {
  position: relative;
  z-index: 1;
  background: rgba(37, 37, 37, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--spacing-3xl);
  width: 100%;
  max-width: 600px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 80px rgba(255, 215, 0, 0.1);
}

/* Header */
.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.logo-icon {
  font-size: var(--font-size-4xl);
  color: var(--color-gold);
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: glow 2s ease-in-out infinite alternate;
}

.auth-title {
  font-family: var(--font-primary);
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-cream);
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.auth-subtitle {
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  line-height: 1.5;
}

/* Progress Indicator */
.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-3xl);
  gap: var(--spacing-md);
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.progress-step.active {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid var(--color-gold);
}

.progress-step.completed {
  background: rgba(255, 215, 0, 0.2);
}

.progress-step i {
  font-size: var(--font-size-lg);
  color: var(--color-medium-gray);
  transition: color 0.3s ease;
}

.progress-step.active i,
.progress-step.completed i {
  color: var(--color-gold);
}

.progress-step span {
  font-size: var(--font-size-xs);
  color: var(--color-light-gray);
  font-weight: 500;
}

.progress-step.active span,
.progress-step.completed span {
  color: var(--color-gold);
}

.progress-line {
  width: 40px;
  height: 2px;
  background: var(--color-medium-gray);
  transition: background 0.3s ease;
}

.progress-line.active {
  background: var(--color-gold);
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-step {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* Input Groups */
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.input-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-cream);
}

.input-label i {
  color: var(--color-gold);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.auth-form input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-3xl) var(--spacing-md) var(--spacing-lg);
  background: var(--color-darker-charcoal);
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  transition: all 0.3s ease;
}

.auth-form input:focus {
  outline: none;
  border-color: var(--color-gold);
  background: var(--color-charcoal);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}

.auth-form input.input-error {
  border-color: #ff6b6b;
}

.auth-form input::placeholder {
  color: var(--color-medium-gray);
}

.input-icon {
  position: absolute;
  left: var(--spacing-md);
  color: var(--color-medium-gray);
  pointer-events: none;
  transition: color 0.3s ease;
}

.auth-form input:focus + .input-icon {
  color: var(--color-gold);
}

.availability-indicator {
  position: absolute;
  right: var(--spacing-md);
  color: var(--color-gold);
}

.password-toggle {
  position: absolute;
  right: var(--spacing-md);
  background: none;
  border: none;
  color: var(--color-medium-gray);
  cursor: pointer;
  padding: var(--spacing-sm);
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: var(--color-gold);
}

/* Password Strength */
.password-strength {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: var(--color-medium-gray);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: var(--radius-sm);
}

.strength-fill.very-weak {
  background: #ff4444;
}
.strength-fill.weak {
  background: #ff8800;
}
.strength-fill.fair {
  background: #ffaa00;
}
.strength-fill.good {
  background: #88dd00;
}
.strength-fill.strong {
  background: #44dd44;
}
.strength-fill.very-strong {
  background: var(--color-gold);
}

.strength-text {
  font-size: var(--font-size-xs);
  color: var(--color-light-gray);
  min-width: 80px;
}

/* Profile Section */
.profile-section {
  text-align: center;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-xl);
  color: var(--color-gold);
  margin-bottom: var(--spacing-md);
}

.section-description {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xl);
}

/* Avatar Upload */
.avatar-upload-container {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}

.avatar-upload-area {
  position: relative;
  width: 200px;
  height: 200px;
  border: 2px dashed var(--color-medium-gray);
  border-radius: 50%;
  background: var(--color-darker-charcoal);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.avatar-upload-area:hover,
.avatar-upload-area.dragover {
  border-color: var(--color-gold);
  background: rgba(255, 215, 0, 0.05);
}

.avatar-upload-area.has-image {
  border-style: solid;
  border-color: var(--color-gold);
}

.file-input {
  display: none;
}

.upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--spacing-lg);
  text-align: center;
}

.upload-icon {
  font-size: var(--font-size-3xl);
  color: var(--color-gold);
  margin-bottom: var(--spacing-md);
}

.upload-prompt h4 {
  color: var(--color-cream);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-sm);
}

.upload-prompt p {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
}

.upload-link {
  color: var(--color-gold);
  font-weight: 500;
}

.file-requirements {
  color: var(--color-medium-gray);
  font-size: var(--font-size-xs);
}

.avatar-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-preview:hover .avatar-overlay {
  opacity: 1;
}

.remove-avatar-btn,
.change-avatar-btn {
  background: var(--color-gold);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  color: var(--color-charcoal);
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-avatar-btn:hover {
  background: #ff4444;
  color: white;
}

.change-avatar-btn:hover {
  background: var(--color-light-yellow);
}

/* Terms Section */
.terms-section {
  margin: var(--spacing-lg) 0;
}

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  cursor: pointer;
}

.terms-checkbox input[type='checkbox'] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-sm);
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.terms-checkbox input:checked + .checkmark {
  background: var(--color-gold);
  border-color: var(--color-gold);
}

.terms-checkbox input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  color: var(--color-charcoal);
  font-size: 12px;
  font-weight: bold;
}

.terms-text {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.terms-text a {
  color: var(--color-gold);
  text-decoration: none;
}

.terms-text a:hover {
  text-decoration: underline;
}

/* Form Navigation */
.form-navigation {
  display: flex;
  gap: var(--spacing-md);
  justify-content: space-between;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
}

.nav-button.secondary {
  background: var(--color-darker-charcoal);
  color: var(--color-cream);
  border: 2px solid var(--color-medium-gray);
}

.nav-button.secondary:hover {
  border-color: var(--color-gold);
  background: var(--color-charcoal);
}

.nav-button.primary {
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
  color: var(--color-charcoal);
}

.nav-button.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-light-yellow), var(--color-gold));
  transform: translateY(-2px);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Submit Button */
.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
  color: var(--color-charcoal);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 100%;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-light-yellow), var(--color-gold));
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: var(--spacing-lg) 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-medium-gray);
}

.divider span {
  background: var(--color-charcoal);
  color: var(--color-light-gray);
  padding: 0 var(--spacing-md);
  font-size: var(--font-size-sm);
}

/* Social Login */
.social-login {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  background: var(--color-darker-charcoal);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  border-color: var(--color-gold);
  background: var(--color-charcoal);
}

.social-btn.discord:hover {
  border-color: #5865f2;
  background: rgba(88, 101, 242, 0.1);
}

.social-btn.twitter:hover {
  border-color: #1da1f2;
  background: rgba(29, 161, 242, 0.1);
}

/* Footer */
.auth-footer {
  text-align: center;
  margin-top: var(--spacing-lg);
}

.auth-link {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
}

.login-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-gold);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-link:hover {
  color: var(--color-light-yellow);
  transform: translateX(2px);
}

/* Error Messages */
.error-message {
  color: #ff6b6b;
  font-size: var(--font-size-xs);
}

.success-message {
  color: #4caf50;
  font-size: var(--font-size-xs);
}

.error-banner {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid #ff6b6b;
  border-radius: var(--radius-md);
  color: #ff6b6b;
  font-size: var(--font-size-sm);
}

/* Animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateX(-50%) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(-20px);
  }
}

@keyframes glow {
  from {
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }
  to {
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.pi-spinner {
  animation: spin 1s linear infinite;
}

/* Responsive Design */
@media (max-width: 768px) {
  .auth-container {
    padding: var(--spacing-lg);
  }

  .auth-box {
    padding: var(--spacing-xl);
  }

  .auth-title {
    font-size: var(--font-size-2xl);
  }

  .progress-indicator {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .progress-line {
    width: 2px;
    height: 20px;
  }

  .form-navigation {
    flex-direction: column;
  }

  .nav-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .auth-box {
    padding: var(--spacing-lg);
  }

  .avatar-upload-area {
    width: 120px;
    height: 120px;
  }

  .social-login {
    gap: var(--spacing-sm);
  }

  .social-btn {
    font-size: var(--font-size-sm);
  }
}
</style>
