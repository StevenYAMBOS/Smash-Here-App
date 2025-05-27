<!-- src/views/Auth/LoginView.vue -->

<template>
  <div class="auth-box">
    <h1 class="auth-title">Login</h1>
    <p class="auth-subtitle">Welcome back to Smash Here</p>

    <form @submit.prevent="handleLogin" class="auth-form">
      <input type="email" v-model="email" placeholder="Email address" required />
      <input type="password" v-model="password" placeholder="Password" required />

      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in…' : 'Login' }}
      </button>

      <p class="auth-link">
        No account yet?
        <router-link to="/auth/register">Register</router-link>
      </p>
      <p v-if="error" class="status error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const toast = useToast()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const userStore = useUserStore()

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: password.value }),
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
    toast.success('Login successful!')
    // redirige vers la liste des jeux
    router.push('/')
  } catch (err: any) {
    toast.error(err.message || 'Login failed.')
    error.value = err.message || 'Login failed.'
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
</style>
