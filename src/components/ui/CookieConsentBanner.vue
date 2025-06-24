<!-- src/components/ui/CookieConsentBanner.vue -->

<template>
  <Transition name="banner">
    <div v-if="showBanner" class="cookie-consent-banner" role="dialog" aria-labelledby="cookie-banner-title">
      <div class="banner-content">
        <!-- Icône et titre -->
        <div class="banner-header">
          <i class="pi pi-info-circle banner-icon"></i>
          <h3 id="cookie-banner-title" class="banner-title">We use cookies</h3>
        </div>

        <!-- Message principal -->
        <div class="banner-message">
          <p>
            We use cookies to enhance your gaming experience, analyze site traffic, and provide
            personalized content. By clicking "Accept All", you consent to our use of cookies.
          </p>
          <router-link to="/legal/cookies" class="privacy-link">
            Learn more about our cookie policy
          </router-link>
        </div>

        <!-- Boutons d'action -->
        <div class="banner-actions">
          <button
            class="btn btn--secondary"
            @click="rejectNonEssentialCookies"
            aria-label="Reject non-essential cookies"
          >
            <i class="pi pi-times"></i>
            Reject All
          </button>

          <button
            class="btn btn--outline"
            @click="showCustomizeModal = true"
            aria-label="Customize cookie preferences"
          >
            <i class="pi pi-cog"></i>
            Customize
          </button>

          <button
            class="btn btn--primary"
            @click="acceptAllCookies"
            aria-label="Accept all cookies"
          >
            <i class="pi pi-check"></i>
            Accept All
          </button>
        </div>
      </div>

      <!-- Modal de personnalisation -->
      <Transition name="modal">
        <div v-if="showCustomizeModal" class="modal-overlay" @click="closeCustomizeModal">
          <div class="customize-modal" @click.stop role="dialog" aria-labelledby="customize-modal-title">
            <div class="modal-header">
              <h3 id="customize-modal-title" class="modal-title">Cookie Preferences</h3>
              <button
                class="modal-close"
                @click="closeCustomizeModal"
                aria-label="Close preferences modal"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>

            <div class="modal-content">
              <p class="modal-description">
                Choose which types of cookies you want to allow. These settings will be saved to your device.
              </p>

              <!-- Options de cookies -->
              <div class="cookie-options">
                <!-- Cookies nécessaires -->
                <div class="cookie-option">
                  <div class="option-header">
                    <label class="option-label">
                      <input
                        type="checkbox"
                        v-model="tempPreferences.necessary"
                        disabled
                        class="option-checkbox"
                      >
                      <span class="checkbox-custom"></span>
                      <span class="option-title">Strictly Necessary</span>
                      <span class="option-badge required">Required</span>
                    </label>
                  </div>
                  <p class="option-description">
                    These cookies are essential for the website to function properly.
                    They include authentication and session management.
                  </p>
                </div>

                <!-- Cookies fonctionnels -->
                <div class="cookie-option">
                  <div class="option-header">
                    <label class="option-label">
                      <input
                        type="checkbox"
                        v-model="tempPreferences.functional"
                        class="option-checkbox"
                      >
                      <span class="checkbox-custom"></span>
                      <span class="option-title">Functional</span>
                    </label>
                  </div>
                  <p class="option-description">
                    These cookies remember your preferences and settings to improve your experience.
                  </p>
                </div>

                <!-- Cookies analytics -->
                <div class="cookie-option">
                  <div class="option-header">
                    <label class="option-label">
                      <input
                        type="checkbox"
                        v-model="tempPreferences.analytics"
                        class="option-checkbox"
                      >
                      <span class="checkbox-custom"></span>
                      <span class="option-title">Analytics</span>
                    </label>
                  </div>
                  <p class="option-description">
                    These cookies help us understand how users interact with our platform.
                  </p>
                </div>

                <!-- Cookies tiers -->
                <div class="cookie-option">
                  <div class="option-header">
                    <label class="option-label">
                      <input
                        type="checkbox"
                        v-model="tempPreferences.thirdParty"
                        class="option-checkbox"
                      >
                      <span class="checkbox-custom"></span>
                      <span class="option-title">Third-Party</span>
                    </label>
                  </div>
                  <p class="option-description">
                    These cookies are set by external services like YouTube, social media, and analytics tools.
                  </p>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button class="btn btn--secondary" @click="closeCustomizeModal">
                Cancel
              </button>
              <button class="btn btn--primary" @click="saveCustomPreferences">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCookieConsent, type CookiePreferences } from '@/composables/useCookieConsent'

// Utilisation du composable
const {
  showBanner,
  // cookiePreferences,
  acceptAllCookies,
  rejectNonEssentialCookies,
  saveCustomPreferences: savePreferences,
  initializeCookieConsent
} = useCookieConsent()

// État local du modal
const showCustomizeModal = ref(false)
const tempPreferences = ref<CookiePreferences>({
  necessary: true,
  functional: false,
  analytics: false,
  thirdParty: false
})

// Ouvrir le modal de personnalisation
// const openCustomizeModal = () => {
//   // Copier les préférences actuelles
//   tempPreferences.value = { ...cookiePreferences.value }
//   showCustomizeModal.value = true
// }

// Fermer le modal de personnalisation
const closeCustomizeModal = () => {
  showCustomizeModal.value = false
}

// Sauvegarder les préférences personnalisées
const saveCustomPreferences = () => {
  savePreferences(tempPreferences.value)
  closeCustomizeModal()
}

// Initialiser au montage
onMounted(() => {
  initializeCookieConsent()
})
</script>

<style scoped>
/* Bandeau principal */
.cookie-consent-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, var(--color-darker-charcoal), var(--color-charcoal));
  border-top: 2px solid var(--color-gold);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.banner-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.banner-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.banner-icon {
  color: var(--color-gold);
  font-size: var(--font-size-xl);
}

.banner-title {
  color: var(--color-cream);
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin: 0;
}

.banner-message {
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
  line-height: 1.5;
}

.banner-message p {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-sm);
}

.privacy-link {
  color: var(--color-gold);
  text-decoration: underline;
  font-size: var(--font-size-sm);
  transition: color 0.3s ease;
}

.privacy-link:hover {
  color: var(--color-light-yellow);
}

.banner-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

/* Boutons */
.btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-gold), var(--color-orange));
  color: var(--color-charcoal);
}

.btn--primary:hover {
  background: linear-gradient(135deg, var(--color-light-yellow), var(--color-gold));
  transform: translateY(-2px);
}

.btn--secondary {
  background: var(--color-medium-gray);
  color: var(--color-cream);
}

.btn--secondary:hover {
  background: var(--color-light-gray);
  transform: translateY(-2px);
}

.btn--outline {
  background: transparent;
  color: var(--color-gold);
  border: 2px solid var(--color-gold);
}

.btn--outline:hover {
  background: var(--color-gold);
  color: var(--color-charcoal);
  transform: translateY(-2px);
}

/* Modal de personnalisation */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.customize-modal {
  background: var(--color-darker-charcoal);
  border: 2px solid var(--color-gold);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-medium-gray);
}

.modal-title {
  color: var(--color-cream);
  font-family: var(--font-primary);
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: var(--color-medium-gray);
  font-size: var(--font-size-lg);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: all 0.3s ease;
}

.modal-close:hover {
  color: var(--color-cream);
  background: var(--color-charcoal);
}

.modal-content {
  padding: var(--spacing-lg);
}

.modal-description {
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: 1.5;
}

/* Options de cookies */
.cookie-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.cookie-option {
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  transition: border-color 0.3s ease;
}

.cookie-option:hover {
  border-color: var(--color-gold);
}

.option-header {
  margin-bottom: var(--spacing-sm);
}

.option-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.option-checkbox {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-medium-gray);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.option-checkbox:checked + .checkbox-custom {
  background: var(--color-gold);
  border-color: var(--color-gold);
}

.option-checkbox:checked + .checkbox-custom::after {
  content: '✓';
  color: var(--color-charcoal);
  font-weight: bold;
  font-size: var(--font-size-sm);
}

.option-checkbox:disabled + .checkbox-custom {
  background: var(--color-gold);
  border-color: var(--color-gold);
  opacity: 0.7;
}

.option-title {
  color: var(--color-cream);
  font-family: var(--font-secondary);
  font-weight: 600;
  font-size: var(--font-size-base);
}

.option-badge {
  padding: 2px var(--spacing-xs);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.option-badge.required {
  background: var(--color-orange);
  color: var(--color-white);
}

.option-description {
  color: var(--color-light-gray);
  font-family: var(--font-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.4;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-medium-gray);
}

/* Animations */
.banner-enter-active,
.banner-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.banner-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.banner-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .banner-content {
    padding: var(--spacing-md);
  }

  .banner-actions {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .customize-modal {
    width: 95%;
    margin: var(--spacing-md);
  }

  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .banner-header {
    align-items: flex-start;
  }

  .option-label {
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .option-title {
    font-size: var(--font-size-sm);
  }
}
</style>
