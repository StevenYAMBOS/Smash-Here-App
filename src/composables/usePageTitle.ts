// src/composables/usePageTitle.ts (nouveau fichier à créer)

// import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export function usePageTitle() {
  const route = useRoute()
  const baseTitle = 'Smash Here'
  
  // Fonction pour mettre à jour le titre dynamiquement
  const updateTitle = (title: string) => {
    document.title = `${baseTitle} | ${title}`
  }
  
  // Fonction pour restaurer le titre par défaut
  const resetTitle = () => {
    const routeTitle = route.meta.title as string
    if (routeTitle) {
      document.title = `${baseTitle} | ${routeTitle}`
    } else {
      document.title = baseTitle
    }
  }
  
  return {
    updateTitle,
    resetTitle,
    baseTitle
  }
}