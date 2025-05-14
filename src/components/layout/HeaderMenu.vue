<template>
  <header class="header-menu">
    <div class="header-content">
      <h1 class="header-title">{{ title }}</h1>
      <p class="header-subTitle">{{ subTitle }}</p>
      <button v-if="buttonText && buttonLink" class="header-button" @click="navigateTo">
        {{ buttonText }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { defineProps } from 'vue'

const props = defineProps<{
  title: string
  subTitle: string
  buttonText?: string
  buttonLink?: string
}>()

const router = useRouter()

const navigateTo = () => {
  if (props.buttonLink) router.push(props.buttonLink)
}
</script>

<style scoped>
.header-menu {
  background-color: var(--color-black);
  height: 100vh;
  padding: var(--spacing-2xl) var(--spacing-md);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2xl);
  max-width: 800px;
}

.header-title {
  color: var(--color-cream);
  font-size: var(--font-size-5xl);
  font-family: var(--font-primary);
  font-weight: bold;
}

.header-subTitle {
  color: var(--color-light-gray);
  font-size: var(--font-size-lg);
  font-family: var(--font-secondary);
}

.header-button {
  display: inline-block;
  background-color: var(--color-gold);
  color: var(--color-black);
  font-weight: 800;
  padding: var(--spacing-sm) var(--spacing-xl);
  border: none;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.header-button:hover {
  background-color: var(--color-light-yellow);
}

.header-button:hover {
  background-color: var(--color-light-yellow);
}
</style>
