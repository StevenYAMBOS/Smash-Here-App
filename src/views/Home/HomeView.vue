<!-- src/views/Home/HomeView.vue -->

<script setup lang="ts">
import HeaderMenu from '@/components/layout/HeaderMenu.vue'
// import NumbersCard from '@/components/layout/NumbersCard.vue'
import GamesSlider from '@/components/ui/GamesSlider.vue'
import RoadmapsSlider from '@/components/ui/RoadmapsSlider.vue'
</script>

<template>
  <main>
    <HeaderMenu
      title="Master the art of combat"
      subTitle="Customized roadmaps - Structured progress - Active community"
      button-link="/games"
      button-text="Start now !"
    />
    <!-- <NumbersCard /> -->

    <!-- Section "JEUX" -->
    <section id="games-section" class="games-section">
      <div class="games-section-container">
        <h2>Games</h2>
        <GamesSlider />
      </div>
    </section>

    <!-- Section "ROADMAPS" -->
    <section id="roadmaps-section" class="roadmaps-section">
      <div class="roadmaps-section-container">
        <h2>Roadmaps</h2>
        <RoadmapsSlider />
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
