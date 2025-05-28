<!-- src/components/ui/ProfileDetails.vue -->

<template>
  <div class="profile-details">
    <div class="detail-item">
      <label>ID</label>
      <span>{{ profile.id }}</span>
    </div>
    <div class="detail-item">
      <label>Email</label>
      <span>{{ profile.email }}</span>
    </div>
    <div class="detail-item">
      <label>Roadmaps created</label>
      <span>{{ (profile.RoadmapsCreated ?? []).length }}</span>
    </div>
    <div class="detail-item">
      <label>Bookmarks</label>
      <span>{{ (profile.Bookmarks ?? []).length }}</span>
    </div>
    <div class="detail-item">
      <label>Registered date</label>
      <span>{{ formattedDate(profile.createdAt) }}</span>
    </div>
    <div class="detail-item">
      <label>Last login session</label>
      <span>{{ formattedDate(profile.lastLogin) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { User } from '@/types/collections'

const props = defineProps<{ profile: User }>()

function formattedDate(iso: string) {
  return new Date(iso).toLocaleDateString('en', {
    year: '2-digit',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.profile-details {
  margin: var(--spacing-2xl) var(--spacing-md);
  background: var(--color-charcoal);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}
.detail-item {
  display: flex;
  flex-direction: column;
}
.detail-item label {
  font-size: var(--font-size-sm);
  color: var(--color-light-gray);
  margin-bottom: var(--spacing-xs);
}
.detail-item span {
  color: var(--color-cream);
  font-size: var(--font-size-base);
}
</style>
