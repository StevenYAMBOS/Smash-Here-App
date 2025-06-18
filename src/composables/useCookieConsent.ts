// src/composables/useCookieConsent.ts

import { ref } from 'vue'

export interface CookiePreferences {
  necessary: boolean // Toujours true, non modifiable
  functional: boolean
  analytics: boolean
  thirdParty: boolean
}

export interface CookieConsentData {
  hasConsented: boolean
  consentDate: string
  preferences: CookiePreferences
  version: string // Version de la politique de cookies
}

// Clé de stockage dans le localStorage
const STORAGE_KEY = 'smash-here-cookie-consent'
const CURRENT_POLICY_VERSION = '1.0'

// État global du consentement
const showBanner = ref(false)
const cookiePreferences = ref<CookiePreferences>({
  necessary: true, // Toujours activé
  functional: false,
  analytics: false,
  thirdParty: false
})
const hasConsented = ref(false)

export function useCookieConsent() {
  
  // Charger les préférences depuis le localStorage
  const loadConsentData = (): CookieConsentData | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null
      
      const data: CookieConsentData = JSON.parse(stored)
      
      // Vérifier si la version de la politique a changé
      if (data.version !== CURRENT_POLICY_VERSION) {
        return null // Redemander le consentement si nouvelle version
      }
      
      return data
    } catch (error) {
      console.error('Erreur lors du chargement des préférences cookies:', error)
      return null
    }
  }

  // Sauvegarder les préférences dans le localStorage
  const saveConsentData = (preferences: CookiePreferences) => {
    const consentData: CookieConsentData = {
      hasConsented: true,
      consentDate: new Date().toISOString(),
      preferences,
      version: CURRENT_POLICY_VERSION
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData))
      hasConsented.value = true
      cookiePreferences.value = { ...preferences }
      showBanner.value = false
      
      // Appliquer les préférences immédiatement
      applyCookiePreferences(preferences)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences cookies:', error)
    }
  }

  // Accepter tous les cookies
  const acceptAllCookies = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      thirdParty: true
    }
    saveConsentData(allAccepted)
  }

  // Refuser les cookies non essentiels
  const rejectNonEssentialCookies = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      thirdParty: false
    }
    saveConsentData(onlyNecessary)
  }

  // Sauvegarder les préférences personnalisées
  const saveCustomPreferences = (preferences: CookiePreferences) => {
    // S'assurer que les cookies nécessaires restent activés
    preferences.necessary = true
    saveConsentData(preferences)
  }

  // Appliquer les préférences de cookies
  const applyCookiePreferences = (preferences: CookiePreferences) => {
    // Gestion des cookies analytics (ex: Google Analytics)
    if (preferences.analytics) {
      enableAnalytics()
    } else {
      disableAnalytics()
    }

    // Gestion des cookies fonctionnels
    if (preferences.functional) {
      enableFunctionalCookies()
    } else {
      disableFunctionalCookies()
    }

    // Gestion des cookies tiers
    if (preferences.thirdParty) {
      enableThirdPartyCookies()
    } else {
      disableThirdPartyCookies()
    }
  }

  // Activer les analytics
  const enableAnalytics = () => {
    // Exemple: initialiser Google Analytics ou autre
    console.log('Analytics cookies activés')
    // gtag('config', 'GA_MEASUREMENT_ID')
  }

  // Désactiver les analytics
  const disableAnalytics = () => {
    console.log('Analytics cookies désactivés')
    // Supprimer les cookies analytics existants
    deleteCookiesByPattern(/^_ga/)
    deleteCookiesByPattern(/^_gid/)
  }

  // Activer les cookies fonctionnels
  const enableFunctionalCookies = () => {
    console.log('Cookies fonctionnels activés')
    // Autoriser le stockage des préférences utilisateur
  }

  // Désactiver les cookies fonctionnels
  const disableFunctionalCookies = () => {
    console.log('Cookies fonctionnels désactivés')
    // Limiter les fonctionnalités de préférences
  }

  // Activer les cookies tiers
  const enableThirdPartyCookies = () => {
    console.log('Cookies tiers activés')
    // Autoriser YouTube, réseaux sociaux, etc.
  }

  // Désactiver les cookies tiers
  const disableThirdPartyCookies = () => {
    console.log('Cookies tiers désactivés')
    // Bloquer les intégrations externes
  }

  // Supprimer les cookies par pattern
  const deleteCookiesByPattern = (pattern: RegExp) => {
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      if (pattern.test(name)) {
        // Supprimer le cookie
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
      }
    })
  }

  // Réinitialiser le consentement (pour les paramètres)
  const resetConsent = () => {
    localStorage.removeItem(STORAGE_KEY)
    hasConsented.value = false
    showBanner.value = true
    
    // Désactiver tous les cookies non essentiels
    rejectNonEssentialCookies()
  }

  // Initialiser le système de consentement
  const initializeCookieConsent = () => {
    const storedConsent = loadConsentData()
    
    if (storedConsent) {
      // L'utilisateur a déjà donné son consentement
      hasConsented.value = true
      cookiePreferences.value = storedConsent.preferences
      showBanner.value = false
      
      // Appliquer les préférences stockées
      applyCookiePreferences(storedConsent.preferences)
    } else {
      // Première visite ou nouvelle version de la politique
      hasConsented.value = false
      showBanner.value = true
      
      // Appliquer uniquement les cookies nécessaires par défaut
      applyCookiePreferences({
        necessary: true,
        functional: false,
        analytics: false,
        thirdParty: false
      })
    }
  }

  // Vérifier si un type de cookie est autorisé
  const isCookieTypeAllowed = (type: keyof CookiePreferences): boolean => {
    return cookiePreferences.value[type]
  }

  // Obtenir la date du consentement
  const getConsentDate = (): string | null => {
    const storedConsent = loadConsentData()
    return storedConsent?.consentDate || null
  }

  return {
    // État
    showBanner,
    cookiePreferences,
    hasConsented,
    
    // Actions
    acceptAllCookies,
    rejectNonEssentialCookies,
    saveCustomPreferences,
    resetConsent,
    initializeCookieConsent,
    
    // Utilitaires
    isCookieTypeAllowed,
    getConsentDate,
    
    // Constantes
    CURRENT_POLICY_VERSION
  }
}