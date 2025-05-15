<!-- src/components/ui/GameCard.vue -->

<template>
  <div class="game-card" @click="goToGame">
    <div class="image-wrapper">
      <img :src="cover" :alt="title" class="game-image" />
    </div>
    <h2 class="game-title">{{ title }}</h2>
    <p class="game-subTitle">{{ subTitle }}</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')

const goToGame = () => {
  const slug = generateSlug(props.title)
  router.push(`/game/${slug}`)
}

const props = defineProps<{
  cover: string
  title: string
  subTitle: string
  id: string
}>()

const router = useRouter()

// const goToGame = () => {
//   router.push(`/game/${props.id}`)
// }
</script>

<style scoped>
.game-card {
  width: 400px;
  height: 400px;
  background-color: var(--color-charcoal);
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.game-card:hover {
  /* transform: translateY(-2px); */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.image-wrapper {
  width: 360px;
  height: 220px;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.game-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease-in-out;
}

.game-card:hover .game-image {
  transform: scale(1.05);
}

.game-title {
  margin-top: var(--spacing-md);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-xl);
  text-align: center;
}

.game-subTitle {
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  text-align: center;
  margin-top: var(--spacing-xs);
}
</style>
