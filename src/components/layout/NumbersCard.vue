<template>
  <main class="number-menu">
    <!-- Nombre -->
    <div class="number-content">
      <h2 class="number-title">+100</h2>
      <p class="number-subTitle">active players</p>
    </div>
    <!-- Nombre -->
    <div class="number-content">
      <h2 class="number-title">+50</h2>
      <p class="number-subTitle">roadmaps</p>
    </div>
    <!-- Nombre -->
    <div class="number-content">
      <h2 class="number-title">+100</h2>
      <p class="number-subTitle">coachs</p>
    </div>
  </main>
</template>

<style scoped>
.number-menu {
  background-color: var(--color-darker-charcoal);
  height: auto;
  padding: var(--spacing-2xl) var(--spacing-md);
  display: flex;
  flex-direction: row;
  gap: var(--spacing-md);
  justify-content: space-evenly;
  align-items: center;
}

.number-content {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  text-align: start;
}

.number-title {
  color: var(--color-gold);
  font-size: var(--font-size-xl);
  font-family: var(--font-primary);
}

.number-subTitle {
  color: var(--color-cream);
  /* font-size: var(--font-size-lg); */
  font-family: var(--font-secondary);
}
</style>
