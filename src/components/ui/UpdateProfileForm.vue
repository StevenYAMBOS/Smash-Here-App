<!-- src/components/ui/UpdateProfileForm.vue -->
<template>
  <form @submit.prevent="submitProfile" class="update-profile-form">
    <h2>Modifier mes informations</h2>

    <div class="form-section">
      <div class="field">
        <label for="username">Username</label>
        <input 
          id="username" 
          v-model="username" 
          type="text" 
          :placeholder="userStore.profile?.username"
          maxlength="30"
        />
        <p class="field-hint">Maximum 30 caractères, doit contenir au moins une lettre (optionnel)</p>
      </div>

      <div class="field">
        <label for="password">New Password</label>
        <div class="password-input-wrapper">
          <input 
            id="password" 
            v-model="password" 
            :type="showPassword ? 'text' : 'password'"
            placeholder="Nouveau mot de passe (optionnel)"
            minlength="6"
          />
          <button 
            type="button" 
            class="password-toggle-btn"
            @click="showPassword = !showPassword"
            :title="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
          >
            <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>
        <p class="field-hint">Minimum 6 caractères (optionnel)</p>
      </div>

      <div class="field">
        <label for="profilePicture">Profile Picture</label>

        <!-- Zone de prévisualisation (cliquable) -->
        <div class="profile-preview-wrapper" @click="triggerFileInput">
          <img
            v-if="profilePreview"
            :src="profilePreview"
            alt="Profile Preview"
            class="profile-preview-img"
          />
          <div v-else class="profile-placeholder">
            <i class="pi pi-user"></i>
            <span>Nouvelle photo de profil...</span>
          </div>
        </div>

        <!-- Input file (caché) -->
        <input
          id="profilePicture"
          type="file"
          accept="image/webp,image/png,image/jpeg"
          @change="handleFileChange"
          class="file-input"
        />

        <p class="file-hint">Formats acceptés : WEBP, PNG, JPEG (max 10 MB)</p>
      </div>
    </div>

    <div class="actions-row">
      <SubmitButton
        label="Cancel"
        icon="pi pi-times"
        variant="secondary"
        type="button"
        @click="$emit('cancel')"
      />
      <SubmitButton
        :label="loading ? 'Saving...' : 'Save Changes'"
        :disabled="loading || !isFormValid"
        icon="pi pi-save"
        variant="primary"
        type="submit"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toast-notification'
import SubmitButton from './SubmitButton.vue'

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'cancel'): void
}>()

const userStore = useUserStore()
const toast = useToast()

// Données du formulaire
const username = ref('')
const password = ref('')
const profileFile = ref<File | null>(null)
const profilePreview = ref<string | null>(null)
const loading = ref(false)
const showPassword = ref(false) // Nouvel état pour afficher/masquer le mot de passe

// Validation du formulaire - maintenant plus flexible
const isFormValid = computed(() => {
  // Au moins un champ doit être modifié pour valider
  const hasUsernameChange = username.value.trim() !== '' && username.value !== userStore.profile?.username
  const hasPasswordChange = password.value.trim() !== ''
  const hasImageChange = profileFile.value !== null
  
  // Si rien n'a changé, le formulaire est invalide
  if (!hasUsernameChange && !hasPasswordChange && !hasImageChange) {
    return false
  }
  
  // Si le username est modifié, il doit être valide
  if (hasUsernameChange) {
    const hasLetter = /[A-Za-z]/.test(username.value)
    if (username.value.length === 0 || username.value.length > 30 || !hasLetter) {
      return false
    }
  }
  
  // Si le password est modifié, il doit être valide
  if (hasPasswordChange && password.value.length < 6) {
    return false
  }
  
  return true
})

// Initialiser les valeurs avec le profil actuel
onMounted(() => {
  if (userStore.profile) {
    // Ne pas pré-remplir les champs, laisser vides pour indiquer "pas de changement"
    profilePreview.value = userStore.profile.profilePicture || null
  }
})

// Gestion de l'upload d'image
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Validation taille et type
  if (file.size > 10 * 1024 * 1024) {
    toast.error('La taille de l\'image doit être inférieure à 10 MB.')
    return
  }
  
  const validTypes = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg']
  if (!validTypes.includes(file.type)) {
    toast.error('Format d\'image invalide (WEBP, PNG, JPEG uniquement).')
    return
  }

  // Enregistrer le fichier sélectionné
  profileFile.value = file

  // Générer une URL locale pour affichage de prévisualisation
  profilePreview.value = URL.createObjectURL(file)
}

// Déclencher le sélecteur de fichier
function triggerFileInput() {
  const fileInput = document.getElementById('profilePicture') as HTMLInputElement
  fileInput?.click()
}

// Soumission du formulaire
async function submitProfile() {
  if (loading.value || !isFormValid.value) return
  
  loading.value = true

  try {
    // Créer le FormData uniquement avec les champs modifiés
    const formData = new FormData()
    
    // Ajouter le username seulement s'il a été modifié
    const hasUsernameChange = username.value.trim() !== '' && username.value !== userStore.profile?.username
    if (hasUsernameChange) {
      formData.append('username', username.value.trim())
    }
    
    // Ajouter le password seulement s'il a été modifié
    const hasPasswordChange = password.value.trim() !== ''
    if (hasPasswordChange) {
      formData.append('password', password.value)
    }
    
    // Ajouter l'image seulement si elle a été sélectionnée
    if (profileFile.value) {
      formData.append('profilePicture', profileFile.value)
    }
    
    // Vérifier qu'au moins un champ a été modifié
    if (!hasUsernameChange && !hasPasswordChange && !profileFile.value) {
      toast.error('Aucune modification détectée.')
      loading.value = false
      return
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/user/profile`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userStore.token}`,
          // Ne pas définir Content-Type pour multipart/form-data
        },
        body: formData,
      }
    )

    if (response.ok) {
      toast.success('Profil mis à jour avec succès!')
      
      // Recharger le profil utilisateur pour obtenir les dernières données
      await userStore.fetchProfile()
      
      // Émettre l'événement de succès
      emit('success')
      
      // Réinitialiser le formulaire
      resetForm()
    } else {
      const errorData = await response.text()
      let errorMessage = 'Erreur lors de la mise à jour du profil'
      
      try {
        const errorJson = JSON.parse(errorData)
        errorMessage = errorJson.error || errorMessage
      } catch {
        // Si ce n'est pas du JSON, utiliser le texte brut
        errorMessage = errorData || errorMessage
      }
      
      toast.error(errorMessage)
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    toast.error('Erreur de connexion au serveur.')
  } finally {
    loading.value = false
  }
}

// Réinitialiser le formulaire
function resetForm() {
  // Vider les champs modifiables
  username.value = ''
  password.value = ''
  profileFile.value = null
  showPassword.value = false // Remettre le mot de passe masqué
  
  // Remettre la photo de profil actuelle
  if (userStore.profile) {
    profilePreview.value = userStore.profile.profilePicture || null
  }
}
</script>

<style scoped>
.update-profile-form {
  background: var(--color-darker-charcoal);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.update-profile-form h2 {
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  color: var(--color-gold);
  font-weight: bold;
  margin: 0 0 var(--spacing-lg) 0;
  text-align: center;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.field label {
  font-size: var(--font-size-base);
  font-family: var(--font-secondary);
  color: var(--color-cream);
  font-weight: bold;
}

.field input[type="text"],
.field input[type="password"] {
  padding: var(--spacing-md);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  background: var(--color-dark-gray);
  font-size: var(--font-size-base);
  font-family: var(--font-secondary);
  color: var(--color-cream);
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
}

/* Wrapper pour le champ password avec bouton toggle */
.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  flex: 1;
  padding-right: 50px; /* Espace pour le bouton */
}

.password-toggle-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--color-medium-gray);
  cursor: pointer;
  font-size: var(--font-size-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: color 0.2s ease;
}

.password-toggle-btn:hover {
  color: var(--color-gold);
}

.field input:focus {
  outline: none;
  border-color: var(--color-gold);
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
}

.field-hint,
.file-hint {
  font-size: var(--font-size-sm);
  color: var(--color-medium-gray);
  margin-top: var(--spacing-xs);
}

/* Styles pour la prévisualisation de la photo de profil */
.profile-preview-wrapper {
  width: 120px;
  height: 120px;
  border: 2px dashed var(--color-medium-gray);
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  background: var(--color-dark-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: border-color 0.2s ease;
}

.profile-preview-wrapper:hover {
  border-color: var(--color-gold);
}

.profile-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-placeholder {
  text-align: center;
  color: var(--color-medium-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.profile-placeholder i {
  font-size: var(--font-size-2xl);
}

.file-input {
  display: none;
}

.actions-row {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

/* Responsive */
@media (max-width: 768px) {
  .update-profile-form {
    padding: var(--spacing-lg);
    margin: var(--spacing-md);
  }

  .update-profile-form h2 {
    font-size: var(--font-size-xl);
  }

  .field input[type="text"],
  .field input[type="password"] {
    padding: var(--spacing-sm);
  }

  .profile-preview-wrapper {
    width: 100px;
    height: 100px;
  }

  .actions-row {
    flex-direction: column-reverse;
    gap: var(--spacing-md);
  }

  .actions-row button {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .update-profile-form {
    padding: var(--spacing-md);
  }

  .profile-preview-wrapper {
    width: 80px;
    height: 80px;
  }

  .profile-placeholder {
    font-size: var(--font-size-xs);
  }
}
</style>