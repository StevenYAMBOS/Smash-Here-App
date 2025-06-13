<!-- src/views/User/UserAccount.vue -->
<template>
  <div class="account-container">
    <!-- Menu latéral -->
    <AccountMenu v-model:selected="selectedTab" />

    <!-- Contenu de la page -->
    <section class="account-content">
      <!-- Informations utilisateur -->
      <template v-if="selectedTab === 'informations'">
        <ProfileHeader v-if="userStore.profile" :profile="userStore.profile" />
        <ProfileDetails v-if="userStore.profile" :profile="userStore.profile" />
        <p v-else class="status">Chargement des informations...</p>
      </template>

      <!-- Liste des roadmaps -->
      <template v-if="selectedTab === 'roadmaps'">
        <!-- Si au moins une roadmap -->
        <div class="roadmaps-list-container" v-if="userStore.roadmapsCreated?.length">
          <SearchBar placeholder="Search for your roadmaps" v-model="searchText" />

          <UserRoadmapCard
            v-for="rm in filteredRoadmaps"
            :key="rm.id"
            :roadmap="rm"
            :showView="true"
            :showStats="false"
            :showEdit="false"
            :showDelete="false"
            @view="(id) => router.push(`/roadmap/${id}`)"
          />
        </div>
        <!-- Sinon -->
        <p v-else class="status">Vous n’avez créé aucune roadmap.</p>
      </template>

      <!-- Liste des bookmarks -->
      <template v-if="selectedTab === 'bookmarks'">
        <!-- Si au moins une roadmap -->
        <div class="roadmaps-list-container" v-if="userStore.bookmarks?.length">
          <SearchBar placeholder="Search for your bookmarks" v-model="searchText" />

          <UserRoadmapCard
            v-for="rm in filteredBookmarks"
            :key="rm.id"
            :roadmap="rm"
            :showView="true"
            :showEdit="false"
            :showDelete="false"
            :show-premium="false"
            :show-published="false"
            @view="(id) => router.push(`/roadmap/${id}`)"
          />
        </div>
        <!-- Sinon -->
        <p v-else class="status">No bookmarks.</p>
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
import UserRoadmapCard from '@/components/ui/UserRoadmapCard.vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/ui/SearchBar.vue'
import { computed } from 'vue'

const userStore = useUserStore()
const selectedTab = ref('informations')
const router = useRouter()

onMounted(async () => {
  await userStore.fetchProfile()
})

const searchText = ref('')

const filteredRoadmaps = computed(() => {
  const list = userStore.roadmapsCreated || []
  if (!searchText.value.trim()) return list
  return list.filter((rm) => rm.title.toLowerCase().includes(searchText.value.toLowerCase()))
})

const filteredBookmarks = computed(() => {
  const list = userStore.bookmarks || []
  if (!searchText.value.trim()) return list
  return list.filter((rm) => rm.title.toLowerCase().includes(searchText.value.toLowerCase()))
})
</script>

<style scoped>
.account-container {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: var(--color-darker-charcoal);
  max-width: 1200px;
  margin: 0 auto;
}
.account-content {
  flex: 1;
  background: var(--color-dark-gray);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}
.status {
  color: var(--color-light-gray);
  text-align: center;
  margin-top: var(--spacing-lg);
}

.roadmaps-list-container {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--spacing-lg);
  gap: var(--spacing-lg);
}
</style>
