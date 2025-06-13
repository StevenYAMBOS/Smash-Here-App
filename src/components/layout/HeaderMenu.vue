<template>
  <header class="header-menu">
    <div class="header-content">
      <h1 class="header-title">{{ title }}</h1>
      <p class="header-subTitle">{{ subTitle }}</p>
      <button v-if="buttonText && buttonLink" class="header-button" @click="navigateTo">
        <!-- <i class="pi pi-sign-in"></i> -->
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

.header-button:hover {
  background: linear-gradient(135deg, var(--color-light-yellow), var(--color-gold));
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}
</style>
