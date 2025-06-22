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
  else router.push('/content-builder')
}

function logout() {
  emit('close')
  userStore.clear()
  router.push('/auth/login')
}
</script>

<style scoped>
.user-menu {
  background: var(--color-darker-charcoal);
  border: 1px solid var(--color-gold);
  border-radius: var(--radius-md);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(255, 215, 0, 0.2);
  z-index: 200;
  min-width: 200px;
  backdrop-filter: blur(10px);
  animation: menuAppear 0.2s ease-out;
}

.user-menu ul {
  list-style: none;
  margin: 0;
  padding: var(--spacing-sm) 0;
}

.user-menu li {
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-cream);
  cursor: pointer;
  font-size: var(--font-size-base);
  font-family: var(--font-secondary);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.user-menu li:hover {
  background: var(--color-charcoal);
  color: var(--color-gold);
  padding-left: var(--spacing-xl);
}

.user-menu li:first-child {
  border-top-left-radius: var(--radius-md);
  border-top-right-radius: var(--radius-md);
}

.user-menu li:last-child {
  border-bottom-left-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
}

/* Animation d'apparition */
@keyframes menuAppear {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .user-menu {
    min-width: 180px;
    font-size: var(--font-size-sm);
  }

  .user-menu li {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .user-menu li:hover {
    padding-left: var(--spacing-lg);
  }
}
</style>
