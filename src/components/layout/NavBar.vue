<!-- src/components/layout/NavBar.vue -->

<template>
  <nav class="navbar">
    <!-- Barre de progression de défilement -->
    <div class="scroll-progress" :style="{ width: scrollProgress + '%' }"></div>

    <div class="navbar-container">
      <!-- Logo avec effet hover amélioré -->
      <router-link to="/" class="navbar-logo" @click="closeAllMenus">
        <div class="logo-wrapper">
          <img src="@/assets/logo.webp" alt="Logo Smash Here" />
          <div class="logo-glow"></div>
        </div>
      </router-link>

      <!-- Desktop Navigation Menu avec indicateur actif -->
      <div class="navbar-menu" :class="{ active: isMobileMenuOpen }">
        <router-link
          to="/"
          class="navbar-link"
          @click="closeAllMenus"
        >
          <i class="pi pi-home link-icon"></i>
          <span>Home</span>
          <div class="link-indicator"></div>
        </router-link>
        <router-link
          to="/games"
          class="navbar-link"
          @click="closeAllMenus"
        >
          <i class="pi pi-gamepad2 link-icon"></i>
          <span>Games</span>
          <div class="link-indicator"></div>
        </router-link>
      </div>

      <!-- User Section avec animations améliorées -->
      <div class="navbar-user">
        <!-- Bouton Login avec design amélioré -->
        <div v-if="!userStore.profile" class="login-section">
          <router-link to="/auth/login" @click="closeAllMenus">
            <NavButton icon="pi pi-user" icon-position="left" :to="`/auth/login`">Login</NavButton>
          </router-link>
        </div>

        <!-- Profile avec design amélioré -->
        <div v-else class="profile-container" @click.stop ref="profileContainer">
          <!-- Notification badge si nécessaire -->
          <div class="notification-badge" v-if="hasNotifications">
            <span>{{ notificationCount }}</span>
          </div>

          <div class="profile-wrapper" @click="toggleUserMenu">
            <div class="profile-ring"></div>
            <img :src="userStore.profile.profilePicture" alt="Profile" class="profile-pic" />
            <div class="profile-status-indicator">
              <div class="status-pulse"></div>
            </div>
          </div>

          <!-- Menu utilisateur avec positionnement dynamique -->
          <Transition name="user-menu" appear>
            <UserMenu
              v-if="isUserMenuOpen"
              @close="closeUserMenu"
              class="user-menu-positioned"
              :style="userMenuStyle"
            />
          </Transition>
        </div>
      </div>

      <!-- Mobile Burger Menu avec animation -->
      <div class="navbar-burger-container" @click="toggleMobileMenu">
        <div class="navbar-burger" :class="{ active: isMobileMenuOpen }">
          <span class="burger-line"></span>
          <span class="burger-line"></span>
          <span class="burger-line"></span>
        </div>
      </div>
    </div>

    <!-- Overlay avec flou gaussien -->
    <Transition name="overlay" appear>
      <div v-if="isUserMenuOpen" class="menu-overlay" @click="closeUserMenu"></div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import NavButton from '@/components/ui/NavButton.vue'
import { useUserStore } from '@/stores/user'
import UserMenu from '@/components/ui/UserMenu.vue'

// États existants
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const userStore = useUserStore()
const profileContainer = ref<HTMLElement | null>(null)

// Nouveaux états pour les améliorations
const scrollProgress = ref(0)
const hasNotifications = ref(false) // À connecter avec votre système de notifications
const notificationCount = ref(3) // Exemple

// Calcul dynamique de la position du menu utilisateur
const userMenuStyle = computed(() => {
  if (!profileContainer.value || !isUserMenuOpen.value) {
    return {}
  }

  const rect = profileContainer.value.getBoundingClientRect()
  const menuWidth = 280 // Largeur approximative du menu utilisateur
  const windowWidth = window.innerWidth
  const spacing = 16 // Espacement depuis le bord

  // Calculer la position horizontale
  let right = windowWidth - rect.right

  // Si le menu dépasserait à gauche, l'ajuster
  if (rect.right - menuWidth < spacing) {
    right = spacing
  }

  // Modification principale : positionner le menu sous la navbar
  // au lieu de sous l'image de profil pour éviter qu'il soit coupé
  const navbarHeight = 105 // Hauteur approximative de la navbar

  return {
    position: 'fixed',
    // Positionner le menu juste en dessous de la navbar
    top: `${navbarHeight}px`,
    right: `${right}px`,
    zIndex: 300
  }
})

// Fonction pour calculer la progression du défilement
const updateScrollProgress = () => {
  const scrolled = window.scrollY
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0
}

// Fonction pour gérer les clics en dehors du menu utilisateur
const handleClickOutside = (event: Event) => {
  const target = event.target as Element

  // Si le clic est en dehors du conteneur du profil, fermer le menu utilisateur
  if (isUserMenuOpen.value && profileContainer.value && !profileContainer.value.contains(target)) {
    isUserMenuOpen.value = false
  }
}

// Fonction pour gérer le redimensionnement de la fenêtre
const handleResize = () => {
  if (isUserMenuOpen.value) {
    // Recalculer la position du menu lors du redimensionnement
    nextTick(() => {
      // Force la réactivité du computed
    })
  }
}

// Lifecycle hooks améliorés
onMounted(() => {
  window.addEventListener('scroll', updateScrollProgress)
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
  updateScrollProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})

// Toggle mobile navigation menu uniquement
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // Fermer le menu utilisateur si ouvert
  if (isUserMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

// Toggle user menu uniquement - correction pour éviter conflit avec menu mobile
const toggleUserMenu = async (event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  isUserMenuOpen.value = !isUserMenuOpen.value
  // Fermer le menu mobile si ouvert
  if (isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
  }

  // Attendre le prochain tick pour que le DOM soit mis à jour
  if (isUserMenuOpen.value) {
    await nextTick()
  }
}

// Fonction pour fermer seulement le menu utilisateur
const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

// Fonction pour fermer tous les menus - logique améliorée
const closeAllMenus = () => {
  isMobileMenuOpen.value = false
  isUserMenuOpen.value = false
}
</script>

<style scoped>
.navbar {
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 200;
  width: 100%;
  transition: all 0.3s ease;
}

.profile-container {
  position: relative;
  z-index: 201;
}

/* Menu utilisateur avec positionnement dynamique */
.user-menu-positioned {
  /* Les styles de position sont maintenant gérés par le computed userMenuStyle */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border-radius: var(--radius-lg);
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  min-width: 280px;
}

/* Menu overlay avec flou gaussien */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 250;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Barre de progression de défilement */
.scroll-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-gold), var(--color-light-yellow));
  transition: width 0.1s ease;
  z-index: 1001;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-sm) var(--spacing-lg);
  font-family: var(--font-secondary);
  position: relative;
}

/* Logo avec effet de lueur */
.navbar-logo {
  width: auto;
  position: relative;
  transition: transform 0.3s ease;
}

.logo-wrapper {
  position: relative;
  display: inline-block;
}

.navbar-logo img {
  height: 80px;
  width: auto;
  filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.2));
  transition: all 0.3s ease;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.navbar-logo:hover .logo-glow {
  opacity: 1;
}

.navbar-logo:hover img {
  transform: scale(1.05);
  filter: drop-shadow(0 6px 12px rgba(255, 215, 0, 0.4));
}

/* Menu de navigation avec indicateurs actifs */
.navbar-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: rgba(37, 37, 37, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: var(--radius-full);
  padding: var(--spacing-sm) var(--spacing-xl);
  font-family: var(--font-secondary);
  position: relative;
  z-index: 200;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.navbar-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-cream);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
  overflow: hidden;
}

.link-icon {
  font-size: var(--font-size-base);
  transition: all 0.3s ease;
}

.link-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--color-gold);
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

.navbar-link:hover {
  color: var(--color-gold);
  background: rgba(255, 215, 0, 0.1);
  transform: translateY(-2px);
}

.navbar-link:hover .link-icon {
  color: var(--color-gold);
  transform: scale(1.1);
}

.navbar-link:hover .link-indicator {
  width: 80%;
}

.navbar-link.router-link-active {
  color: var(--color-gold);
  background: rgba(255, 215, 0, 0.15);
}

.navbar-link.router-link-active .link-indicator {
  width: 100%;
}

/* Section utilisateur moderne */
.navbar-user {
  display: flex;
  align-items: center;
  position: relative;
}

/* Bouton de connexion moderne */
.login-section {
  position: relative;
}

.modern-login-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: linear-gradient(135deg, var(--color-gold), var(--color-light-yellow));
  color: var(--color-charcoal);
  border: none;
  border-radius: var(--radius-full);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-family: var(--font-secondary);
  font-weight: 600;
  font-size: var(--font-size-sm);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.btn-ripple {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.modern-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  font-size: var(--font-size-xs);
  font-weight: bold;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  min-width: 18px;
  text-align: center;
  z-index: 10;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Profile wrapper amélioré */
.profile-wrapper {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 101;
}

.profile-ring {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border: 2px solid transparent;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--color-gold), var(--color-light-yellow)) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: subtract;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: subtract;
  transition: all 0.3s ease;
}

.profile-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.profile-wrapper:hover {
  transform: scale(1.1);
}

.profile-wrapper:hover .profile-ring {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

/* Indicateur de statut amélioré */
.profile-status-indicator {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 14px;
  height: 14px;
  background: #4caf50;
  border: 2px solid var(--color-darker-charcoal);
  border-radius: 50%;
  z-index: 3;
}

.status-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: #4caf50;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: statusPulse 2s infinite;
}

@keyframes statusPulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}

/* Burger menu animé */
.navbar-burger-container {
  display: none;
  padding: var(--spacing-md);
  margin-right: var(--spacing-md);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.3s ease;
  z-index: 101;
  position: relative;
}

.navbar-burger {
  width: 24px;
  height: 18px;
  position: relative;
  display: flex;
  color: var(--color-cream);
  flex-direction: column;
  justify-content: space-between;
}

.burger-line {
  width: 100%;
  height: 2px;
  background: var(--color-cream);
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.navbar-burger.active .burger-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.navbar-burger.active .burger-line:nth-child(2) {
  opacity: 0;
}

.navbar-burger.active .burger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.navbar-burger-container:hover {
  background-color: rgba(255, 215, 0, 0.1);
  transform: scale(1.1);
}

/* Animations de transition */
.user-menu-enter-active,
.user-menu-leave-active {
  transition: all 0.3s ease;
}

.user-menu-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.user-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Responsive amélioré */
@media (max-width: 768px) {
  .navbar-container {
    padding: var(--spacing-xs) var(--spacing-md);
  }

  .navbar-logo img {
    height: 60px;
  }

  .navbar-menu {
    position: fixed;
    top: 70px;
    left: var(--spacing-md);
    right: var(--spacing-md);
    flex-direction: column;
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(20px);
    padding: var(--spacing-lg);
    gap: var(--spacing-md);
    transform: translateY(-20px);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 200;
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: var(--radius-lg);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  }

  .navbar-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .navbar-link {
    width: 100%;
    justify-content: center;
    padding: var(--spacing-md);
    font-size: var(--font-size-base);
  }

  .navbar-burger-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-container {
    z-index: 201;
    position: relative;
  }

  /* Bouton login plus compact sur mobile */
  .modern-login-btn {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 576px) {
  .navbar-container {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .navbar-logo img {
    height: 50px;
  }

  .modern-login-btn span {
    display: none;
  }

  .modern-login-btn {
    width: 40px;
    height: 40px;
    padding: 0;
    justify-content: center;
  }
}
</style>
