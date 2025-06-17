<!-- src/views/User/UserAccount.vue -->
<template>
  <div class="account-container">
    <!-- Menu latéral -->
    <AccountMenu v-model:selected="selectedTab" />

    <!-- Contenu de la page -->
    <section class="account-content">
      <!-- Informations utilisateur -->
      <template v-if="selectedTab === 'informations'">
        <!-- Mode affichage -->
        <template v-if="!editMode">
          <ProfileHeader v-if="userStore.profile" :profile="userStore.profile" />
          <ProfileDetails v-if="userStore.profile" :profile="userStore.profile" />

          <!-- Bouton pour passer en mode édition -->
          <div class="edit-profile-section">
            <SubmitButton
              label="Edit Profile"
              icon="pi pi-pencil"
              variant="primary"
              @click="editMode = true"
            />
          </div>
        </template>

        <!-- Mode édition -->
        <template v-else>
          <UpdateProfileForm @success="handleProfileUpdateSuccess" @cancel="editMode = false" />
        </template>

        <p v-if="!userStore.profile" class="status">Chargement des informations...</p>
      </template>

      <!-- Liste des roadmaps -->
      <template v-if="selectedTab === 'roadmaps'">
        <!-- Si au moins une roadmap -->
        <div class="roadmaps-list-container" v-if="userStore.roadmapsCreated?.length">
          <SearchBar placeholder="Search for your roadmaps" v-model="searchText" />

          <br />

          <UserRoadmapCard
            v-for="rm in filteredRoadmaps"
            :key="rm.id"
            :roadmap="rm"
            :showView="true"
            :showStats="false"
            :showEdit="false"
            :showDelete="false"
            @view="(id) => router.push(`/roadmap/${id}`)"
            @bookmarkChanged="handleBookmarkChange"
          />
        </div>
        <!-- Sinon -->
        <p v-else class="status">Vous n'avez créé aucune roadmap.</p>
      </template>

      <!-- Liste des bookmarks -->
      <template v-if="selectedTab === 'bookmarks'">
        <!-- Si au moins une roadmap -->
        <div class="roadmaps-list-container" v-if="userStore.bookmarks?.length">
          <SearchBar placeholder="Search for your bookmarks" v-model="searchText" />

          <br />

          <UserRoadmapCard
            v-for="rm in filteredBookmarks"
            :key="rm.id"
            :roadmap="rm"
            :showView="true"
            :showEdit="false"
            :showDelete="false"
            :show-premium="false"
            :show-published="false"
            :show-author="true"
            :author="state.authors.get(rm.CreatedBy)"
            @view="(id) => router.push(`/roadmap/${id}`)"
            @bookmarkChanged="handleBookmarkChange"
          />
        </div>
        <!-- Sinon -->
        <p v-else class="status">No bookmarks.</p>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import AccountMenu from '@/components/ui/AccountMenu.vue'
import ProfileHeader from '@/components/ui/ProfileHeader.vue'
import ProfileDetails from '@/components/ui/ProfileDetails.vue'
import UserRoadmapCard from '@/components/ui/UserRoadmapCard.vue'
import UpdateProfileForm from '@/components/ui/UpdateProfileForm.vue'
import SubmitButton from '@/components/ui/SubmitButton.vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/ui/SearchBar.vue'
import { computed } from 'vue'
import type { User } from '@/types/collections'

const userStore = useUserStore()
const selectedTab = ref('informations')
const router = useRouter()
const editMode = ref(false)

const state = reactive({
  authors: new Map<string, User>(),
  authorsLoading: false,
})

// Gérer le succès de la mise à jour
const handleProfileUpdateSuccess = () => {
  editMode.value = false // Retour au mode affichage
}

onMounted(async () => {
  await userStore.fetchProfile()
  if (userStore.profile) {
    await userStore.fetchUserBookmarks()
    await fetchBookmarkAuthors()
  }
})

const fetchBookmarkAuthors = async () => {
  if (!userStore.bookmarks?.length || state.authorsLoading) return

  state.authorsLoading = true

  try {
    // Récupérer les IDs des auteurs uniques des bookmarks
    const authorIds = [...new Set(userStore.bookmarks.map((rm) => rm.CreatedBy))]

    // Faire les appels API pour chaque auteur
    const authorPromises = authorIds.map(async (authorId) => {
      try {
        const userRes = await fetch(
          `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/user/${authorId}`,
        )
        if (userRes.ok) {
          const user = await userRes.json()
          state.authors.set(authorId, user)
        }
      } catch (err) {
        console.error(`Erreur lors du chargement de l'utilisateur ${authorId}:`, err)
        // En cas d'erreur, créer un utilisateur par défaut
        state.authors.set(authorId, {
          id: authorId,
          username: 'Unknown User',
          email: '',
          password: '',
          type: 'user',
          profilePicture: '',
          createdAt: '',
          updatedAt: '',
          lastLogin: '',
          Bookmarks: [],
          RoadmapsStarted: [],
          RoadmapsCreated: [],
          StepsCreated: [],
          ContentsCreated: [],
          Comments: [],
        })
      }
    })

    // Attendre que tous les auteurs soient chargés
    await Promise.all(authorPromises)
  } catch (error) {
    console.error('Erreur lors du chargement des auteurs des bookmarks:', error)
  } finally {
    state.authorsLoading = false
  }
}

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

// Gérer les changements de bookmark pour synchroniser l'interface
const handleBookmarkChange = async (roadmapId: string, isBookmarked: boolean) => {
  // Recharger les bookmarks pour s'assurer de la synchronisation

  // Si on est dans l'onglet bookmarks et qu'une roadmap a été supprimée des bookmarks,
  // on peut optionnellement afficher un message ou mettre à jour l'affichage
  if (selectedTab.value === 'bookmarks' && !isBookmarked) {
    await fetchBookmarkAuthors()
    console.log(`Roadmap ${roadmapId} supprimée des bookmarks`)
  }
}
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

.edit-profile-section {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
}

@media (max-width: 1024px) {
  .account-container {
    padding: var(--spacing-lg);
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .account-container {
    flex-direction: column;
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }

  .account-content {
    width: 100%;
    padding: var(--spacing-md);
  }

  .account-menu {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    overflow-x: auto;
    white-space: nowrap;
    padding: var(--spacing-md);
    background: var(--color-charcoal);
    border-radius: var(--radius-md);
  }

  .menu-item {
    flex: 1;
    min-width: auto;
    text-align: center;
    padding: var(--spacing-sm);
    font-size: var(--font-size-sm);
  }

  .menu-icon {
    display: block;
    margin: 0 auto var(--spacing-xs);
  }

  .menu-text {
    display: block;
    font-size: var(--font-size-xs);
  }

  .roadmaps-list-container {
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }

  .edit-profile-section {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-md);
  }

  .edit-profile-section button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .account-menu {
    padding: var(--spacing-sm);
  }

  .menu-item {
    padding: var(--spacing-xs);
  }

  .menu-text {
    display: none;
  }

  .menu-text {
    font-size: 0.7rem;
  }

  .menu-item[data-tab='informations'] .menu-text::after {
    content: 'Info';
  }

  .menu-item[data-tab='roadmaps'] .menu-text::after {
    content: 'Maps';
  }

  .menu-item[data-tab='bookmarks'] .menu-text::after {
    content: 'Saved';
  }

  .account-container {
    padding: var(--spacing-sm);
  }

  .account-content {
    padding: var(--spacing-sm);
  }

  .roadmaps-list-container {
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
  }
}
</style>
