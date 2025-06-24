// src/router/guards.ts

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/stores/user'

/**
 * Guard pour protéger les routes nécessitant une authentification
 */
export function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const userStore = useUserStore()

  // Vérifier d'abord le token dans le localStorage directement
  // car le store pourrait ne pas être encore initialisé lors du rafraîchissement
  const tokenInStorage = localStorage.getItem('token')

  if (tokenInStorage && tokenInStorage.trim() !== '') {
    // S'assurer que le store a le token
    if (!userStore.token) {
      userStore.setToken(tokenInStorage)
    }
    next()
  } else {
    // Pas de token valide, rediriger vers login
    next('/auth/login')
  }
}

/**
 * Guard pour rediriger les utilisateurs connectés loin des pages d'auth
 */
export function redirectIfAuthenticated(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {

  // Vérifier le token dans le localStorage directement
  const tokenInStorage = localStorage.getItem('token')

  if (tokenInStorage && tokenInStorage.trim() !== '') {
    next('/')
  } else {
    next()
  }
}

/**
 * Guard pour vérifier les rôles utilisateur
 */
export function requireRole(allowedRoles: string[]) {
  return function (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) {
    const userStore = useUserStore()

    if (!userStore.isAuthenticated) {
      next({ name: 'login' })
      return
    }

    if (!allowedRoles.includes(userStore.user?.type || 'user')) {
      next({ name: 'home' })
      return
    }

    next()
  }
}
