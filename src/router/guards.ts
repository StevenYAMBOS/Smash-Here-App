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

  // Vérifier si l'utilisateur est connecté
  if (!userStore.isAuthenticated) {
    // Stocker la route de destination pour rediriger après connexion
    sessionStorage.setItem('redirectAfterLogin', to.fullPath)

    // Rediriger vers la page de connexion
    next({
      name: 'login',
      query: {
        redirect: to.fullPath,
        message: 'Please log in to access this page',
      },
    })
    return
  }

  // L'utilisateur est connecté, autoriser l'accès
  next()
}

/**
 * Guard pour rediriger les utilisateurs connectés loin des pages d'auth
 */
export function redirectIfAuthenticated(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const userStore = useUserStore()

  if (userStore.isAuthenticated) {
    // Vérifier s'il y a une redirection stockée
    const redirectPath = sessionStorage.getItem('redirectAfterLogin')
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterLogin')
      next(redirectPath)
      return
    }

    // Sinon rediriger vers le dashboard
    next({ name: 'dashboard' })
    return
  }

  // L'utilisateur n'est pas connecté, continuer vers la page d'auth
  next()
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
