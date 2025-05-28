<!-- src/components/ui/UserMenu.vue -->

<template>
  <div class="user-menu" @click.stop>
    <ul>
      <li @click="goTo('account')">Account</li>
      <li @click="goTo('content-builder')">Content builder</li>
      <li @click="logout">Logout</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const userStore = useUserStore()

function goTo(page: 'account' | 'content-builder') {
  emit('close')
  if (page === 'account') router.push('/profile')
  else router.push('/dashboard')
}

function logout() {
  emit('close')
  userStore.clear()
  router.push('/auth/login')
}
</script>

<style scoped>
.user-menu {
  position: absolute;
  top: 60px;
  right: 0;
  background: var(--color-darker-charcoal);
  border: 1px solid var(--color-gold);
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  z-index: 200;
}
.user-menu ul {
  list-style: none;
  margin: 0;
  padding: var(--spacing-sm) 0;
}
.user-menu li {
  padding: var(--spacing-sm) var(--spacing-lg);
  color: var(--color-cream);
  cursor: pointer;
  font-size: var(--font-size-base);
}
.user-menu li:hover {
  background: var(--color-charcoal);
}
</style>
