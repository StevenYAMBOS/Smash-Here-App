<!-- src/components/layout/NavBar.vue -->

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo" @click="closeAllMenus">
        <img src="@/assets/logo.webp" alt="Logo Smash Here" />
      </router-link>

      <!-- Desktop Navigation Menu -->
      <div class="navbar-menu" :class="{ active: isMobileMenuOpen }">
        <router-link to="/" class="navbar-link" @click="closeAllMenus">Home</router-link>
        <router-link to="/games" class="navbar-link" @click="closeAllMenus">Games</router-link>
      </div>

      <!-- User Section -->
      <div class="navbar-user">
        <router-link v-if="!userStore.profile" to="/auth/login" @click="closeAllMenus">
          <NavButton :to="`/auth/login`">Login</NavButton>
        </router-link>

        <!-- Profile avec positionnement relatif -->
        <div v-else class="profile-container">
          <div class="profile-wrapper" @click="toggleUserMenu">
            <img :src="userStore.profile.profilePicture" alt="Profile" class="profile-pic" />
            <div class="profile-status-indicator"></div>
          </div>

          <!-- Menu utilisateur avec positionnement dynamique -->
          <UserMenu v-if="isUserMenuOpen" @close="closeUserMenu" class="user-menu-positioned" />
        </div>
      </div>

      <!-- Mobile Burger Menu avec zone de clic élargie -->
      <div class="navbar-burger-container" @click="toggleMobileMenu">
        <div class="navbar-burger">
          <i :class="isMobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
        </div>
      </div>
    </div>

    <!-- Overlay pour fermer les menus -->
    <div
      v-if="isMobileMenuOpen || isUserMenuOpen"
      class="menu-overlay"
      @click="closeAllMenus"
    ></div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavButton from '../ui/NavButton.vue'
import { useUserStore } from '@/stores/user'
import UserMenu from '@/components/ui/UserMenu.vue'

// États séparés pour les deux menus
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const userStore = useUserStore()

// Toggle mobile navigation menu uniquement
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // Fermer le menu utilisateur si ouvert
  if (isUserMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

// Toggle user menu uniquement
const toggleUserMenu = (event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  isUserMenuOpen.value = !isUserMenuOpen.value
  // Fermer le menu mobile si ouvert
  if (isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}

// Fermer le menu utilisateur uniquement
const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

// Fermer tous les menus
const closeAllMenus = () => {
  isMobileMenuOpen.value = false
  isUserMenuOpen.value = false
}
</script>

<style scoped>
.navbar {
  background-color: var(--color-darker-charcoal);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  font-family: var(--font-secondary);
}

.navbar-logo {
  width: auto;
}

.navbar-logo img {
  height: 100px;
  width: auto;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  background-color: var(--color-charcoal);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-2xl);
  font-family: var(--font-secondary);
  position: relative;
  z-index: 200;
}

.navbar-link {
  color: var(--color-cream);
  text-decoration: none;
  font-size: var(--font-size-base);
  padding: var(--spacing-xs) var(--spacing-sm);
  transition: color 0.2s ease;
}

.navbar-link:hover {
  color: var(--color-gold);
}

.navbar-user {
  display: flex;
  align-items: center;
}

/* Container pour le profil avec positionnement relatif */
.profile-container {
  position: relative;
}

/* Photo de profil avec zone de clic élargie */
.profile-wrapper {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid var(--color-gold);
  transition: all 0.3s ease;
  z-index: 101; /* S'assurer qu'il est au-dessus de l'overlay */
}

.profile-wrapper::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: transparent;
  border-radius: 50%;
  z-index: 1;
}

.profile-wrapper:hover {
  border-color: var(--color-light-yellow);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.profile-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 2;
}

/* Indicateur de statut en ligne */
.profile-status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #4caf50;
  border: 2px solid var(--color-darker-charcoal);
  border-radius: 50%;
  z-index: 3;
}

/* Menu utilisateur avec positionnement dynamique */
.user-menu-positioned {
  position: absolute !important;
  top: calc(100% + 10px) !important;
  right: 0 !important;
  left: auto !important;
  transform: none !important;
  z-index: 300 !important; /* Au-dessus de tout */
}

/* Container burger avec zone de clic élargie */
.navbar-burger-container {
  display: none;
  padding: var(--spacing-md);
  margin-right: var(--spacing-md);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background-color 0.3s ease;
  z-index: 101; /* S'assurer qu'il est au-dessus de l'overlay */
  position: relative;
}

.navbar-burger-container:hover {
  background-color: rgba(255, 215, 0, 0.1);
}

.navbar-burger {
  color: var(--color-cream);
  font-size: var(--font-size-xl);
  transition: color 0.3s ease;
}

.navbar-burger-container:hover .navbar-burger {
  color: var(--color-gold);
}

/* Overlay pour fermer les menus */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 50;
  backdrop-filter: blur(2px);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .navbar-menu {
    position: fixed;
    top: 100px;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: var(--color-darker-charcoal);
    padding: var(--spacing-lg) 0;
    gap: var(--spacing-lg);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden; /* Ajout pour éviter les interactions fantômes */
    transition: all 0.3s ease;
    z-index: 200;
    border-top: 1px solid var(--color-medium-gray);
  }

  .navbar-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible; /* Rendre visible quand actif */
  }

  .navbar-burger-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Ajustement du menu utilisateur en mobile */
  .user-menu-positioned {
    right: var(--spacing-md) !important;
    left: auto !important;
    z-index: 300 !important;
  }

  /* S'assurer que les éléments interactifs restent cliquables */
  .profile-container {
    z-index: 101;
    position: relative;
  }
}

@media (max-width: 576px) {
  .navbar-container {
    padding: 0 var(--spacing-sm);
  }

  .navbar-logo img {
    height: 80px;
  }

  .navbar-burger-container {
    margin-right: var(--spacing-sm);
    padding: var(--spacing-sm);
  }

  /* Menu utilisateur responsive */
  .user-menu-positioned {
    right: var(--spacing-sm) !important;
    min-width: 180px;
    z-index: 300 !important;
  }
}
</style>
