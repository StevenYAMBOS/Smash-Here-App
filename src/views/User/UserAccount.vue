<!-- src/views/User/UserAccount.vue -->
<template>
  <div class="account-container">
    <!-- Menu latéral -->
    <AccountMenu v-model:selected="selectedTab" />

    <!-- Contenu de la page -->
    <section class="account-content">
      <template v-if="selectedTab === 'Informations'">
        <ProfileHeader v-if="userStore.profile" :profile="userStore.profile" />
        <ProfileDetails v-if="userStore.profile" :profile="userStore.profile" />
        <p v-else class="status">Chargement des informations...</p>
      </template>
      <template v-else>
        <p class="status">{{ selectedTab }} en cours de construction.</p>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import AccountMenu from '@/components/ui/AccountMenu.vue'
import ProfileHeader from '@/components/ui/ProfileHeader.vue'
import ProfileDetails from '@/components/ui/ProfileDetails.vue'

const userStore = useUserStore()
const selectedTab = ref('Informations')

onMounted(async () => {
  await userStore.fetchProfile()
})
</script>

<style scoped>
.account-container {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  background: var(--color-darker-charcoal);
}
.account-content {
  flex: 1;
  background: var(--color-charcoal);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}
.status {
  color: var(--color-light-gray);
  text-align: center;
  margin-top: var(--spacing-lg);
}
</style>
