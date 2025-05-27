<!-- src/views/Auth/RegisterView.vue -->

<template>
  <div class="auth-box">
    <h1 class="auth-title">Register</h1>
    <p class="auth-subtitle">Join Smash Here</p>

    <form @submit.prevent="handleRegister" class="auth-form" enctype="multipart/form-data">
      <!-- Username -->
      <!-- <label for="username" class="input-label">Username</label> -->
      <input
        id="username"
        type="text"
        v-model="username"
        placeholder="Enter your username"
        required
      />

      <!-- Email -->
      <!-- <label for="email" class="input-label">Email Address</label> -->
      <input id="email" type="email" v-model="email" placeholder="Enter your email" required />

      <!-- Password -->
      <!-- <label for="password" class="input-label">Password</label> -->
      <input
        id="password"
        type="password"
        v-model="password"
        placeholder="Create a password"
        required
      />

      <!-- Profile Picture -->
      <!-- <label class="input-label">Profile Picture</label> -->
      <div class="file-input-wrapper">
        <input id="profilePicture" type="file" @change="onFileChange" accept="image/*" required />
        <span class="file-input-text">
          {{ file ? file.name : 'Choose a profile picture image...' }}
        </span>
      </div>

      <button type="submit" :disabled="loading" class="submit-button">
        {{ loading ? 'Registering…' : 'Register' }}
      </button>

      <p class="auth-link">
        Already have an account ?
        <router-link to="/auth/login">Login</router-link>
      </p>
      <p v-if="error" class="status error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const toast = useToast()
const username = ref('')
const email = ref('')
const password = ref('')
const file = ref<File | null>(null)
const loading = ref(false)
const error = ref('')

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  file.value = input.files?.[0] ?? null
}

async function handleRegister() {
  if (!file.value) {
    toast.warning('Please select a profile picture.')
    return
  }

  loading.value = true
  error.value = ''

  const form = new FormData()
  form.append('username', username.value)
  form.append('email', email.value)
  form.append('password', password.value)
  form.append('profilePicture', file.value)

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/auth/register`,
      { method: 'POST', body: form },
    )
    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || `HTTP ${res.status}`)
    }
    toast.success('Registration successful!')
    // redirige vers login
    router.push('/auth/login')
  } catch (err: any) {
    toast.error(err.message || 'Registration failed.')
    error.value = err.message || 'Registration failed.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-box {
  background-color: var(--color-charcoal);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.auth-title {
  font-family: var(--font-primary);
  color: var(--color-cream);
  font-size: var(--font-size-3xl);
  text-align: center;
}

.auth-subtitle {
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
  text-align: center;
  font-size: var(--font-size-base);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.auth-form input {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-darker-charcoal);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-secondary);
}

.auth-form input::placeholder {
  color: var(--color-light-gray);
}

.auth-form button {
  background-color: var(--color-gold);
  color: var(--color-black);
  font-weight: 700;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-form button:hover {
  background-color: var(--color-light-yellow);
}

.auth-link {
  color: var(--color-light-gray);
  text-align: center;
  font-size: var(--font-size-sm);
}

.auth-link a {
  color: var(--color-gold);
  font-weight: 600;
  text-decoration: none;
}

label {
  color: var(--color-cream);
  font-size: var(--font-size-sm);
  font-weight: bold;
  padding: 0;
  margin: 0;
}

.auth-form .input-label {
  color: var(--color-cream);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
}
.auth-form input[type='text'],
.auth-form input[type='email'],
.auth-form input[type='password'] {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-darker-charcoal);
  color: var(--color-cream);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-secondary);
}

.file-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-darker-charcoal);
  border: 1px dashed var(--color-medium-gray);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
}
.file-input-wrapper input[type='file'] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.file-input-text {
  color: var(--color-light-gray);
  font-size: var(--font-size-sm);
  pointer-events: none;
}

.submit-button {
  background-color: var(--color-gold);
  color: var(--color-black);
  font-weight: 700;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.3s ease;
  /* margin: var(--spacing-lg) 0; */
}
.submit-button:hover:not(:disabled) {
  background-color: var(--color-light-yellow);
}
.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
