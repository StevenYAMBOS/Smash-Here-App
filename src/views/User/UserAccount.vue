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

          <!-- Section de suppression de compte -->
          <div class="danger-zone">
            <h3 class="danger-title">
              <i class="pi pi-exclamation-triangle"></i>
              Danger Zone
            </h3>
            <p class="danger-description">
              Once you delete your account, there is no going back. This action will permanently
              delete your account and all associated data including roadmaps, guides, and remove
              your content from other users' bookmarks.
            </p>
            <SubmitButton
              label="Delete Account"
              icon="pi pi-trash"
              variant="danger"
              @click="showDeleteConfirmation = true"
            />
          </div>
        </template>

        <!-- Mode édition -->
        <template v-else>
          <UpdateProfileForm @success="handleProfileUpdateSuccess" @cancel="editMode = false" />
        </template>

        <p v-if="!userStore.profile" class="status">Chargement des informations...</p>
      </template>

      <!-- Autres onglets... (roadmaps, bookmarks, guides) -->
      <template v-if="selectedTab === 'roadmaps'">
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
        <p v-else class="status">No roadmaps.</p>
      </template>

      <template v-if="selectedTab === 'bookmarks'">
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
        <p v-else class="status">No bookmarks.</p>
      </template>

      <template v-if="selectedTab === 'guides'">
        <div class="roadmaps-list-container" v-if="userStore.guidesCreated?.length">
          <SearchBar placeholder="Search for your guides" v-model="searchText" />
          <br />
          <UserGuideCard
            v-for="guide in filteredGuides"
            :key="guide.id"
            :guide="guide"
            :showView="true"
            :showEdit="false"
            :showDelete="false"
            :show-premium="false"
            :show-published="true"
            :show-author="true"
            :author="state.authors.get(guide.CreatedBy)"
            @view="(id) => router.push(`/guide/${id}`)"
          />
        </div>
        <p v-else class="status">No guides.</p>
      </template>

      <template v-if="selectedTab === 'attachments'">
        <div class="roadmaps-list-container" v-if="userStore.attachmentsCreated?.length">
          <SearchBar placeholder="Search for your attachments" v-model="searchText" />
          <br />
          <UserAttachmentCard
            v-for="attachment in filteredAttachments"
            :key="attachment.id"
            :attachment="attachment"
            :showView="false"
            :showEdit="false"
            :showDelete="false"
            :show-premium="false"
            :show-published="false"
            :show-author="true"
            :author="state.authors.get(attachment.CreatedBy)"
          />
        </div>
        <p v-else class="status">No attachments.</p>
      </template>
    </section>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteConfirmation" class="modal-backdrop" @click="cancelDelete">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="pi pi-exclamation-triangle"></i>
            Delete Account
          </h2>
        </div>

        <div class="modal-content">
          <p class="modal-warning">
            <strong>This action is irreversible!</strong>
            Your account and ALL associated data will be permanently deleted.
          </p>

          <div class="cascade-info">
            <h4>The following data will be deleted:</h4>
            <ul class="cascade-list">
              <li><i class="pi pi-user"></i> Your profile and personal information</li>
              <li>
                <i class="pi pi-map"></i> All roadmaps you created ({{
                  userStore.roadmapsCreated?.length || 0
                }})
              </li>
              <li>
                <i class="pi pi-book"></i> All guides you created ({{
                  userStore.guidesCreated?.length || 0
                }})
              </li>
              <li>
                <i class="pi pi-list"></i> All steps you created ({{
                  userStore.stepsCreated?.length || 0
                }})
              </li>
              <li>
                <i class="pi pi-file"></i> All contents you created ({{
                  userStore.contentsCreated?.length || 0
                }})
              </li>
              <li>
                <i class="pi pi-paperclip"></i> All attachments you uploaded ({{
                  userStore.attachmentsCreated?.length || 0
                }})
              </li>
              <li><i class="pi pi-comments"></i> All your comments and replies</li>
              <li><i class="pi pi-chart-line"></i> Your progress on all roadmaps</li>
            </ul>
          </div>

          <div class="impact-warning">
            <h4><i class="pi pi-users"></i> Impact on other users:</h4>
            <ul class="impact-list">
              <li>Your roadmaps will be removed from other users' bookmarks</li>
              <li>Users following your roadmaps will lose their progress</li>
              <li>Comments referencing your content will be anonymized</li>
              <li>Your guides will be removed from content references</li>
            </ul>
          </div>

          <div class="confirmation-input">
            <label for="confirmText"> Type <strong>"DELETE MY ACCOUNT"</strong> to confirm: </label>
            <input
              id="confirmText"
              v-model="confirmationText"
              type="text"
              placeholder="DELETE MY ACCOUNT"
              class="confirmation-field"
            />
          </div>
        </div>

        <div class="modal-actions">
          <button @click="cancelDelete" class="btn-cancel">
            <i class="pi pi-times"></i>
            Cancel
          </button>
          <button
            @click="confirmDelete"
            :disabled="!canConfirmDelete || isDeleting"
            class="btn-delete"
          >
            <i class="pi pi-trash"></i>
            <span v-if="isDeleting">Deleting...</span>
            <span v-else>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import AccountMenu from '@/components/ui/AccountMenu.vue'
import ProfileHeader from '@/components/ui/ProfileHeader.vue'
import ProfileDetails from '@/components/ui/ProfileDetails.vue'
import UserRoadmapCard from '@/components/ui/UserRoadmapCard.vue'
import UserGuideCard from '@/components/ui/UserGuideCard.vue'
import UpdateProfileForm from '@/components/ui/UpdateProfileForm.vue'
import SubmitButton from '@/components/ui/SubmitButton.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import type { User } from '@/types/collections'
import UserAttachmentCard from '@/components/ui/UserAttachmentCard.vue'

const userStore = useUserStore()
const router = useRouter()
const toast = useToast()

const selectedTab = ref('informations')
const editMode = ref(false)
const searchText = ref('')

// États pour la suppression de compte
const showDeleteConfirmation = ref(false)
const confirmationText = ref('')
const isDeleting = ref(false)

const state = reactive({
  authors: new Map<string, User>(),
  authorsLoading: false,
})

// Computed pour vérifier si l'utilisateur peut confirmer la suppression
const canConfirmDelete = computed(() => {
  return confirmationText.value === 'DELETE MY ACCOUNT'
})

// Gérer le succès de la mise à jour
const handleProfileUpdateSuccess = () => {
  editMode.value = false
}

// Fonction pour annuler la suppression
const cancelDelete = () => {
  showDeleteConfirmation.value = false
  confirmationText.value = ''
}

// Fonction pour confirmer la suppression
const confirmDelete = async () => {
  if (!canConfirmDelete.value || isDeleting.value) return

  isDeleting.value = true

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userStore.token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      toast.success('Account deleted successfully')
      // Nettoyer le store et rediriger
      userStore.logout()
      router.push('/')
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      toast.error(`Failed to delete account: ${errorData.message}`)
    }
  } catch (error) {
    console.error('Error deleting account:', error)
    toast.error('Network error occurred while deleting account')
  } finally {
    isDeleting.value = false
    showDeleteConfirmation.value = false
    confirmationText.value = ''
  }
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
    const authorIds = [...new Set(userStore.bookmarks.map((rm) => rm.CreatedBy))]
    const authorPromises = authorIds.map(async (authorId) => {
      try {
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/user/${authorId}`)
        if (userRes.ok) {
          const user = await userRes.json()
          state.authors.set(authorId, user)
        }
      } catch (err) {
        console.error(`Erreur lors du chargement de l'utilisateur ${authorId}:`, err)
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
          GuidesCreated: [],
          AttachmentsCreated: [],
        })
      }
    })

    await Promise.all(authorPromises)
  } catch (error) {
    console.error('Erreur lors du chargement des auteurs des bookmarks:', error)
  } finally {
    state.authorsLoading = false
  }
}

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

const filteredGuides = computed(() => {
  const list = userStore.guidesCreated || []
  if (!searchText.value.trim()) return list
  return list.filter((guide) => guide.title.toLowerCase().includes(searchText.value.toLowerCase()))
})

const filteredAttachments = computed(() => {
  const list = userStore.attachmentsCreated || []
  if (!searchText.value.trim()) return list
  return list.filter((attachment) =>
    attachment.fileName.toLowerCase().includes(searchText.value.toLowerCase()),
  )
})

const handleBookmarkChange = async (roadmapId: string, isBookmarked: boolean) => {
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

/* Danger Zone */
.danger-zone {
  margin-top: var(--spacing-3xl);
  padding: var(--spacing-xl);
  border: 2px solid #e74c3c;
  border-radius: var(--radius-lg);
  background: rgba(231, 76, 60, 0.05);
}

.danger-title {
  color: #e74c3c;
  font-family: var(--font-primary);
  font-size: var(--font-size-xl);
  font-weight: bold;
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.danger-description {
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: var(--color-darker-charcoal);
  border: 2px solid #e74c3c;
  border-radius: var(--radius-lg);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: var(--spacing-xl);
  border-bottom: 1px solid rgba(231, 76, 60, 0.3);
}

.modal-title {
  color: #e74c3c;
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  font-weight: bold;
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.modal-content {
  padding: var(--spacing-xl);
}

.modal-warning {
  color: var(--color-cream);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(231, 76, 60, 0.1);
  border-radius: var(--radius-md);
  border-left: 4px solid #e74c3c;
}

.cascade-info,
.impact-warning {
  margin-bottom: var(--spacing-xl);
}

.cascade-info h4,
.impact-warning h4 {
  color: var(--color-gold);
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: bold;
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.cascade-list,
.impact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cascade-list li,
.impact-list li {
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding-left: var(--spacing-md);
}

.cascade-list i,
.impact-list i {
  color: var(--color-gold);
  min-width: 16px;
}

.confirmation-input {
  margin-bottom: var(--spacing-xl);
}

.confirmation-input label {
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  font-weight: 600;
  display: block;
  margin-bottom: var(--spacing-md);
}

.confirmation-field {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  background: var(--color-charcoal);
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-size: var(--font-size-base);
  transition: border-color 0.3s ease;
}

.confirmation-field:focus {
  outline: none;
  border-color: #e74c3c;
}

.modal-actions {
  padding: var(--spacing-xl);
  border-top: 1px solid rgba(231, 76, 60, 0.3);
  display: flex;
  gap: var(--spacing-lg);
  justify-content: flex-end;
}

.btn-cancel,
.btn-delete {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: var(--color-medium-gray);
  color: var(--color-cream);
}

.btn-cancel:hover {
  background: var(--color-light-gray);
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-2px);
}

.btn-delete:disabled {
  background: var(--color-medium-gray);
  color: var(--color-light-gray);
  cursor: not-allowed;
  transform: none;
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

  .modal-container {
    width: 95%;
    margin: var(--spacing-md);
  }

  .modal-header,
  .modal-content,
  .modal-actions {
    padding: var(--spacing-lg);
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-delete {
    width: 100%;
    justify-content: center;
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

  .menu-item[data-tab='guides'] .menu-text::after {
    content: 'À changer';
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
