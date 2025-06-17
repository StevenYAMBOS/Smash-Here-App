<!-- src/components/ui/ProfileDetails.vue -->

<template>
  <div class="profile-details">
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

defineProps<{ profile: User }>()

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

@media (max-width: 1024px) {
  .profile-details {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--spacing-md);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .profile-details {
    grid-template-columns: 1fr;
    margin: var(--spacing-lg) 0;
    padding: var(--spacing-md);
    gap: var(--spacing-lg);
  }

  .detail-item {
    padding: var(--spacing-md);
    background: var(--color-dark-gray);
    border-radius: var(--radius-sm);
    border-left: 3px solid var(--color-gold);
  }

  .detail-item label {
    font-size: var(--font-size-base);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
  }

  .detail-item span {
    font-size: var(--font-size-lg);
    font-weight: 500;
  }
}

@media (max-width: 480px) {
  .profile-details {
    margin: var(--spacing-md) 0;
    padding: var(--spacing-sm);
    gap: var(--spacing-md);
  }

  .detail-item {
    padding: var(--spacing-sm);
  }

  .detail-item label {
    font-size: var(--font-size-sm);
  }

  .detail-item span {
    font-size: var(--font-size-base);
  }
}
</style>
