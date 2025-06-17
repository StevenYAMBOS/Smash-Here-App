<!-- src/components/ui/ProfileHeader.vue -->

<template>
  <div class="profile-header">
    <img :src="profile.profilePicture" alt="Photo de profil" class="profile-pic" />
    <h2 class="username">{{ profile.username }}</h2>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { User } from '@/types/collections'

// On reçoit un objet `profile` de type `User`
defineProps<{ profile: User }>()
</script>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-charcoal);
  border-radius: var(--radius-md);
}
.profile-pic {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-gold);
}
.username {
  color: var(--color-cream);
  font-family: var(--font-primary);
  font-size: var(--font-size-xl);
  margin: 0;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    padding: var(--spacing-lg);
    gap: var(--spacing-lg);
  }

  .profile-pic {
    width: 80px;
    height: 80px;
  }

  .username {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }

  .profile-pic {
    width: 72px;
    height: 72px;
  }

  .username {
    font-size: var(--font-size-xl);
  }
}
</style>
