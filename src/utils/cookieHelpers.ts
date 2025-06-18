/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/cookieHelpers.ts
// Utilitaires pour utiliser les cookies en respectant le consentement

import { useCookieConsent } from '@/composables/useCookieConsent'

// Wrapper pour localStorage qui respecte le consentement
export const useConsentAwareStorage = () => {
  const { isCookieTypeAllowed } = useCookieConsent()

  const setItem = (key: string, value: string, cookieType: 'functional' | 'analytics' = 'functional') => {
    if (isCookieTypeAllowed(cookieType) || isCookieTypeAllowed('necessary')) {
      try {
        localStorage.setItem(key, value)
        return true
      } catch (error) {
        console.warn('Erreur lors du stockage:', error)
        return false
      }
    }
    return false
  }

  const getItem = (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.warn('Erreur lors de la lecture:', error)
      return null
    }
  }

  const removeItem = (key: string): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn('Erreur lors de la suppression:', error)
      return false
    }
  }

  return {
    setItem,
    getItem,
    removeItem
  }
}

// Wrapper pour les cookies fonctionnels (préférences utilisateur)
export const useUserPreferences = () => {
  const storage = useConsentAwareStorage()

  const savePreference = (key: string, value: any) => {
    return storage.setItem(`user-pref-${key}`, JSON.stringify(value), 'functional')
  }

  const getPreference = (key: string, defaultValue: any = null) => {
    const stored = storage.getItem(`user-pref-${key}`)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return defaultValue
      }
    }
    return defaultValue
  }

  const removePreference = (key: string) => {
    return storage.removeItem(`user-pref-${key}`)
  }

  return {
    savePreference,
    getPreference,
    removePreference
  }
}

// Wrapper pour les analytics avec respect du consentement
export const useAnalytics = () => {
  const { isCookieTypeAllowed } = useCookieConsent()

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (isCookieTypeAllowed('analytics')) {
      // Exemple avec Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters)
      }
      
      // Ou votre solution d'analytics personnalisée
      console.log('Analytics Event:', eventName, parameters)
      
      // Vous pouvez aussi envoyer à votre propre API analytics
      // sendToCustomAnalytics(eventName, parameters)
    }
  }

  const trackPageView = (pagePath: string, pageTitle?: string) => {
    if (isCookieTypeAllowed('analytics')) {
      if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
          page_path: pagePath,
          page_title: pageTitle
        })
      }
      
      console.log('Page View:', pagePath, pageTitle)
    }
  }

  const setUserProperty = (property: string, value: string) => {
    if (isCookieTypeAllowed('analytics')) {
      if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
          custom_map: { [property]: value }
        })
      }
      
      console.log('User Property:', property, value)
    }
  }

  // Tracker les interactions avec les roadmaps
  const trackRoadmapInteraction = (action: string, roadmapId: string, additionalData?: Record<string, any>) => {
    trackEvent('roadmap_interaction', {
      action,
      roadmap_id: roadmapId,
      ...additionalData
    })
  }

  // Tracker les interactions avec les jeux
  const trackGameInteraction = (action: string, gameId: string, additionalData?: Record<string, any>) => {
    trackEvent('game_interaction', {
      action,
      game_id: gameId,
      ...additionalData
    })
  }

  // Tracker les sessions de jeu
  const trackGameSession = (gameId: string, sessionDuration: number) => {
    trackEvent('game_session', {
      game_id: gameId,
      duration_seconds: sessionDuration,
      session_date: new Date().toISOString()
    })
  }

  return {
    trackEvent,
    trackPageView,
    setUserProperty,
    trackRoadmapInteraction,
    trackGameInteraction,
    trackGameSession
  }
}

// Hook pour les réseaux sociaux (cookies tiers)
export const useSocialIntegration = () => {
  const { isCookieTypeAllowed } = useCookieConsent()

  const canLoadSocialWidgets = () => {
    return isCookieTypeAllowed('thirdParty')
  }

  const loadTwitterWidget = () => {
    if (canLoadSocialWidgets()) {
      // Charger le widget Twitter
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      script.charset = 'utf-8'
      document.head.appendChild(script)
    }
  }

  const loadYouTubeEmbed = (containerId: string, videoId: string) => {
    if (canLoadSocialWidgets()) {
      // Charger l'embed YouTube
      const container = document.getElementById(containerId)
      if (container) {
        container.innerHTML = `
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/${videoId}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        `
      }
    } else {
      // Afficher un placeholder
      const container = document.getElementById(containerId)
      if (container) {
        container.innerHTML = `
          <div class="youtube-placeholder" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--color-darker-charcoal);
            border: 2px dashed var(--color-medium-gray);
            border-radius: var(--radius-md);
            padding: var(--spacing-xl);
            text-align: center;
            min-height: 315px;
          ">
            <i class="pi pi-video" style="font-size: 3rem; color: var(--color-medium-gray); margin-bottom: 1rem;"></i>
            <p style="color: var(--color-light-gray); margin-bottom: 1rem;">YouTube video blocked due to cookie preferences</p>
            <button onclick="window.location.reload()" style="
              background: var(--color-gold);
              color: var(--color-charcoal);
              border: none;
              padding: 0.5rem 1rem;
              border-radius: var(--radius-md);
              cursor: pointer;
              font-weight: 600;
            ">Enable third-party cookies to view</button>
          </div>
        `
      }
    }
  }

  const loadDiscordWidget = (serverId: string, containerId: string) => {
    if (canLoadSocialWidgets()) {
      const container = document.getElementById(containerId)
      if (container) {
        container.innerHTML = `
          <iframe 
            src="https://discord.com/widget?id=${serverId}&theme=dark" 
            width="350" 
            height="500" 
            allowtransparency="true" 
            frameborder="0">
          </iframe>
        `
      }
    }
  }

  const enableSocialSharing = () => {
    return canLoadSocialWidgets()
  }

  return {
    canLoadSocialWidgets,
    loadTwitterWidget,
    loadYouTubeEmbed,
    loadDiscordWidget,
    enableSocialSharing
  }
}

// Hook pour la gestion des performances (cookies analytics)
export const usePerformanceTracking = () => {
  const { isCookieTypeAllowed } = useCookieConsent()
  const storage = useConsentAwareStorage()

  const trackPerformance = () => {
    if (isCookieTypeAllowed('analytics')) {
      // Tracker les métriques de performance
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        const metrics = {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: 0,
          firstContentfulPaint: 0
        }

        // Récupérer les métriques de paint si disponibles
        const paintEntries = performance.getEntriesByType('paint')
        paintEntries.forEach(entry => {
          if (entry.name === 'first-paint') {
            metrics.firstPaint = entry.startTime
          } else if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime
          }
        })

        // Stocker les métriques
        storage.setItem('performance-metrics', JSON.stringify(metrics), 'analytics')
        
        console.log('Performance metrics tracked:', metrics)
      }
    }
  }

  const getPerformanceMetrics = () => {
    if (isCookieTypeAllowed('analytics')) {
      const stored = storage.getItem('performance-metrics')
      return stored ? JSON.parse(stored) : null
    }
    return null
  }

  return {
    trackPerformance,
    getPerformanceMetrics
  }
}

// Hook pour la gestion des erreurs (cookies analytics)
export const useErrorTracking = () => {
  const { trackEvent } = useAnalytics()

  const trackError = (error: Error, context?: string) => {
    trackEvent('error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      context: context || 'unknown',
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    })
  }

  const trackApiError = (endpoint: string, status: number, message: string) => {
    trackEvent('api_error', {
      endpoint,
      status_code: status,
      error_message: message,
      timestamp: new Date().toISOString()
    })
  }

  return {
    trackError,
    trackApiError
  }
}

// Plugin Vue pour l'utilisation globale
export const cookieConsentPlugin = {
  install(app: any) {
    // Rendre les utilitaires disponibles globalement
    app.config.globalProperties.$cookieConsent = useCookieConsent()
    app.config.globalProperties.$userPreferences = useUserPreferences()
    app.config.globalProperties.$analytics = useAnalytics()
    app.config.globalProperties.$social = useSocialIntegration()
    app.config.globalProperties.$performance = usePerformanceTracking()
    app.config.globalProperties.$errorTracking = useErrorTracking()

    // Initialiser le tracking global des erreurs
    const { trackError } = useErrorTracking()
    
    window.addEventListener('error', (event) => {
      trackError(new Error(event.message), 'global_error_handler')
    })

    window.addEventListener('unhandledrejection', (event) => {
      trackError(new Error(event.reason), 'unhandled_promise_rejection')
    })
  }
}

// Fonction utilitaire pour nettoyer tous les cookies non autorisés
export const cleanupUnauthorizedCookies = () => {
  const { isCookieTypeAllowed } = useCookieConsent()

  // Nettoyer les cookies analytics si non autorisés
  if (!isCookieTypeAllowed('analytics')) {
    // Supprimer les cookies Google Analytics
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      if (name.match(/^(_ga|_gid|_gat)/)) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      }
    })
  }

  // Nettoyer les cookies tiers si non autorisés
  if (!isCookieTypeAllowed('thirdParty')) {
    // Supprimer les cookies de réseaux sociaux et autres services tiers
    const thirdPartyCookiePatterns = [
      /^(facebook|fb_)/,
      /^(twitter|_twitter)/,
      /^(youtube|yt)/,
      /^(discord)/
    ]

    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      
      thirdPartyCookiePatterns.forEach(pattern => {
        if (pattern.test(name)) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        }
      })
    })
  }
}

// Types pour TypeScript
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $cookieConsent: ReturnType<typeof useCookieConsent>
    $userPreferences: ReturnType<typeof useUserPreferences>
    $analytics: ReturnType<typeof useAnalytics>
    $social: ReturnType<typeof useSocialIntegration>
    $performance: ReturnType<typeof usePerformanceTracking>
    $errorTracking: ReturnType<typeof useErrorTracking>
  }
}

// Déclaration pour gtag (Google Analytics)
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function gtag(...args: any[]): void
}