<!-- src/views/Home/HomeView.vue -->

<script setup lang="ts">
import HeaderMenu from '@/components/layout/HeaderMenu.vue'
// import NumbersCard from '@/components/layout/NumbersCard.vue'
import GamesSlider from '@/components/ui/GamesSlider.vue'
import GuidesSlider from '@/components/ui/GuidesSlider.vue'
import RoadmapsSlider from '@/components/ui/RoadmapsSlider.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { onMounted, onUnmounted } from 'vue'
const { updateTitle, resetTitle } = usePageTitle()

onMounted(async () => {
  updateTitle('Home')
})

onUnmounted(() => {
  resetTitle()
})
</script>

<template>
  <main>
    <HeaderMenu
      title="Let's begin"
      subTitle="Customized roadmaps - Structured progress - Active community"
      button-link="/games"
      button-text="Start now !"
      button-icon="pi pi-play-circle"
      badge-icon="pi pi-sitemap"
      badge="SMASH HERE"
    />
    <!-- <NumbersCard /> -->

    <!-- Section "JEUX" -->
    <section id="games-section" class="games-section">
      <div class="games-section-container">
        <!-- <h2>Games</h2> -->
        <GamesSlider />
      </div>
    </section>

    <!-- Section "ROADMAPS" -->
    <section id="roadmaps-section" class="roadmaps-section">
      <div class="roadmaps-section-container">
        <!-- <h2>Roadmaps</h2> -->
        <RoadmapsSlider />
      </div>
    </section>

    <!-- Section "GUIDES" -->
    <section id="guides-section" class="guides-section">
      <div class="guides-section-container">
        <!-- <h2>Roadmaps</h2> -->
        <GuidesSlider />
      </div>
    </section>
  </main>
</template>

<style scoped>
.games-section {
  width: 100%;
  height: auto;
}

.games-section-container {
  max-width: 1200px;
  padding: var(--spacing-md);
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.games-section h2 {
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  color: var(--color-cream);
  font-weight: bold;
}

.roadmaps-section {
  width: 100%;
  height: auto;
}

.roadmaps-section-container {
  max-width: 1200px;
  padding: var(--spacing-md);
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.roadmaps-section h2 {
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  color: var(--color-cream);
  font-weight: bold;
}
</style>
