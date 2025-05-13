<template>
  <div class="auth-box">
    <h1 class="auth-title">Login</h1>
    <p class="auth-subtitle">Welcome back to Smash Here</p>

    <form @submit.prevent="handleLogin" class="auth-form">
      <input type="email" v-model="email" placeholder="Email adress" required />
      <input type="password" v-model="password" placeholder="Password" required />

      <button type="submit">Login</button>

      <p class="auth-link">
        No account yet ?
        <router-link to="/auth/register">Register</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
const email = ''
const password = ''

const handleLogin = () => {
  console.log('Connexion avec', email, password)
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
