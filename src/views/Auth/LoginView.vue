<!-- src/views/Auth/LoginView.vue -->

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
          <i class="pi pi-gamepad-2 logo-icon"></i>
          <h1 class="auth-title">Welcome Back</h1>
        </div>
        <p class="auth-subtitle">Ready to dominate? Sign in to continue your journey</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="auth-form">
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
              placeholder="Enter your password"
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
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="form-options">
          <!-- <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkmark"></span>
            Remember me
          </label> -->
          <!-- <a href="#" class="forgot-password">Forgot password?</a> -->
        </div>

        <!-- Submit Button -->
        <button type="submit" :disabled="loading" class="submit-button">
          <i v-if="loading" class="pi pi-spin pi-spinner"></i>
          <i v-else class="pi pi-sign-in"></i>
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <!-- Divider -->
        <!-- <div class="divider">
          <span>or</span>
        </div> -->

        <!-- Social Login -->
        <!-- <div class="social-login">
          <button type="button" class="social-btn discord">
            <i class="pi pi-discord"></i>
            Continue with Discord
          </button>
          <button type="button" class="social-btn twitter">
            <i class="pi pi-twitter"></i>
            Continue with Twitter
          </button>
        </div> -->

        <!-- Register Link -->
        <div class="auth-footer">
          <p class="auth-link">
            New to Smash Here?
            <router-link to="/auth/register" class="register-link">
              Create Account
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { useUserStore } from '@/stores/user'
import { getErrorMessage } from '@/utils/errorUtils'

const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

// Form data
const email = ref('')
const password = ref('')
// const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

// Validation errors
const emailError = ref('')
const passwordError = ref('')

// Methods
function togglePassword() {
  showPassword.value = !showPassword.value
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
  } else if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
  } else {
    passwordError.value = ''
  }
}

function clearEmailError() {
  emailError.value = ''
}

function clearPasswordError() {
  passwordError.value = ''
}

async function handleLogin() {
  // Validate form
  validateEmail()
  validatePassword()

  if (emailError.value || passwordError.value) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
          // rememberMe: rememberMe.value,
        }),
      },
    )

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || `HTTP ${res.status}`)
    }

    const { token } = await res.json()
    localStorage.setItem('token', token)
    userStore.setToken(token)
    await userStore.fetchProfile()

    toast.success('Welcome back, champion!')
    router.push('/')
  } catch (err) {
  const errorMessage = getErrorMessage(err) || 'Login failed. Please try again.'
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
  justify-content: center;
  min-height: 100vh;
  position: relative;
  align-items: center;
  /*
  padding: var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-darker-charcoal), var(--color-charcoal));
  */
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
  /* background-image:
    radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 166, 0, 0.1) 0%, transparent 50%);
  animation: pulse 4s ease-in-out infinite; */
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

/* Form */
.auth-form {
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

/* .pi {
  color: var(--color-cream);
}

.pi:hover {
  color: var(--color-gold);
} */

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.auth-form input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-3xl) var(--spacing-md) var(--spacing-lg);
  background: var(--color-black);
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

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--spacing-sm) 0;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-light-gray);
  cursor: pointer;
}

.remember-me input[type='checkbox'] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-sm);
  position: relative;
  transition: all 0.3s ease;
}

.remember-me input:checked + .checkmark {
  background: var(--color-gold);
  border-color: var(--color-gold);
}

.remember-me input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  color: var(--color-charcoal);
  font-size: 12px;
  font-weight: bold;
}

.forgot-password {
  color: var(--color-gold);
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--color-light-yellow);
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

.register-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-gold);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.register-link:hover {
  color: var(--color-light-yellow);
  transform: translateX(2px);
}

/* Error Messages */
.error-message {
  color: #ff6b6b;
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-xs);
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

  .form-options {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .auth-box {
    padding: var(--spacing-lg);
  }

  .social-login {
    gap: var(--spacing-sm);
  }

  .social-btn {
    font-size: var(--font-size-sm);
  }
}
</style>
