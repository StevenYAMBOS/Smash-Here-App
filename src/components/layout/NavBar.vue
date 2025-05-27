<!-- src/components/layout/NavBar.vue -->

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo">
        <img src="@/assets/logo.webp" alt="Logo Smash Here" />
      </router-link>

      <!-- Desktop Navigation Menu -->
      <div class="navbar-menu" :class="{ active: isMenuOpen }">
        <router-link to="/" class="navbar-link">Home</router-link>
        <router-link to="/games" class="navbar-link">Games</router-link>
        <router-link to="/ranking" class="navbar-link">Ranking</router-link>
      </div>

      <!-- Inscription Button -->
      <div class="navbar-user">
        <router-link v-if="!userStore.profile" to="/auth/login">
          <NavButton :to="`/auth/login`">Login</NavButton>
        </router-link>
        <div v-else class="profile-wrapper" @click="goToProfile">
          <img :src="userStore.profile.profilePicture" alt="Profile" class="profile-pic" />
        </div>
      </div>

      <!-- Mobile Burger Menu -->
      <div class="navbar-burger" @click="toggleMenu">
        <i :class="isMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavButton from '../ui/NavButton.vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

// State for mobile menu
const isMenuOpen = ref(false)
const userStore = useUserStore()
const router = useRouter()

// Toggle mobile menu
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// Redirige vers la page de profil (à créer)
function goToProfile() {
  router.push('/profile')
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

/* Photo de profil */
.profile-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid var(--color-gold);
}
.profile-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.navbar-burger {
  display: none;
  color: var(--color-cream);
  font-size: var(--font-size-xl);
  cursor: pointer;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .navbar-menu {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: var(--color-darker-charcoal);
    padding: var(--spacing-md) 0;
    gap: var(--spacing-md);
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 99;
  }

  .navbar-menu.active {
    transform: translateY(0);
    opacity: 1;
  }

  .navbar-search {
    margin-left: var(--spacing-md);
    margin-right: auto;
  }

  .search-input {
    width: 150px;
  }

  .navbar-burger {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: var(--spacing-sm);
  }
}

@media (max-width: 576px) {
  .navbar-search {
    display: none;
  }

  .navbar-menu {
    width: 100%;
    align-items: center;
  }
}
</style>
