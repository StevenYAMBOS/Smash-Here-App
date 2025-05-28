<!-- src/views/User/ContentBuilderView.vue -->

<template>
  <div class="builder-page">
    <ContentBuilderMenu v-model:selected="selectedTab" @navigate="onNavigate" />

    <div class="builder-content">
      <template v-if="selectedTab === 'create-roadmap'">
        <CreateRoadmapForm />
      </template>
      <template v-else-if="selectedTab === 'list-roadmaps'">
        <!-- <UserRoadmapsListView /> -->
      </template>
      <template v-else>
        <p class="status">Section « {{ selectedTab }} » en cours de construction.</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContentBuilderMenu from '@/components/ui/ContentBuilderMenu.vue'
import CreateRoadmapForm from '@/components/ui/CreateRoadmapForm.vue'
// import UserRoadmapsListView from '@/components/ui/UserRoadmapsListView.vue'

const selectedTab = ref('create-roadmap')

function onNavigate(tab: string) {
  selectedTab.value = tab
}
</script>

<style scoped>
.builder-page {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  background: var(--color-darker-charcoal);
}
.builder-content {
  flex: 1;
  background: var(--color-charcoal);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
}
.status {
  color: var(--color-light-gray);
  text-align: center;
  margin-top: var(--spacing-lg);
}
</style>
