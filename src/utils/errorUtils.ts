// src/utils/errorUtils.ts

/**
 * Extrait un message d'erreur lisible depuis une erreur de type unknown
 * @param error - L'erreur à traiter (peut être Error, string, ou autre)
 * @param fallbackMessage - Message par défaut si aucun message n'est trouvé
 * @returns Un message d'erreur sous forme de string
 */
export function getErrorMessage(error: unknown, fallbackMessage = 'An unexpected error occurred'): string {
  // Si c'est une instance d'Error avec un message
  if (error instanceof Error) {
    return error.message || fallbackMessage
  }
  
  // Si c'est directement une string
  if (typeof error === 'string') {
    return error.trim() || fallbackMessage
  }
  
  // Si c'est un objet avec une propriété message
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message
    if (typeof message === 'string') {
      return message.trim() || fallbackMessage
    }
  }
  
  // Fallback par défaut
  return fallbackMessage
}

/**
 * Extrait un message d'erreur spécifique pour les erreurs d'API
 * @param error - L'erreur à traiter
 * @param operation - Le nom de l'opération qui a échoué (ex: 'Login', 'Registration')
 * @returns Un message d'erreur formaté pour l'utilisateur
 */
export function getApiErrorMessage(error: unknown, operation = 'Operation'): string {
  const baseMessage = getErrorMessage(error)
  
  // Messages d'erreur spécifiques pour certains cas courants
  const errorMap: Record<string, string> = {
    'Network Error': 'Connection failed. Please check your internet connection.',
    'Failed to fetch': 'Unable to connect to the server. Please try again.',
    'Unauthorized': 'Invalid credentials. Please check your email and password.',
    'Forbidden': 'Access denied. You do not have permission to perform this action.',
    'Not Found': 'The requested resource was not found.',
    'Conflict': 'This action conflicts with existing data.',
    'Too Many Requests': 'Too many attempts. Please try again later.',
    'Internal Server Error': 'Server error. Please try again later.',
    'Bad Gateway': 'Server temporarily unavailable. Please try again later.',
    'Service Unavailable': 'Service temporarily unavailable. Please try again later.',
  }
  
  // Vérifier si le message correspond à un cas connu
  for (const [key, value] of Object.entries(errorMap)) {
    if (baseMessage.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }
  
  // Retourner le message original ou un message par défaut
  return baseMessage || `${operation} failed. Please try again.`
}

/**
 * Extrait un code de statut HTTP depuis une erreur
 * @param error - L'erreur à analyser
 * @returns Le code de statut ou null si non trouvé
 */
export function getErrorStatusCode(error: unknown): number | null {
  // Si c'est une Response d'une fetch API
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: unknown }).status
    if (typeof status === 'number') {
      return status
    }
  }
  
  // Si c'est une erreur avec un message contenant un code HTTP
  const message = getErrorMessage(error)
  const httpCodeMatch = message.match(/HTTP\s+(\d{3})/i)
  if (httpCodeMatch) {
    return parseInt(httpCodeMatch[1], 10)
  }
  
  return null
}

/**
 * Détermine si une erreur est due à un problème réseau
 * @param error - L'erreur à analyser
 * @returns true si c'est un problème réseau
 */
export function isNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  const networkKeywords = [
    'network error',
    'failed to fetch',
    'connection failed',
    'network request failed',
    'offline',
    'no internet',
    'timeout'
  ]
  
  return networkKeywords.some(keyword => message.includes(keyword))
}

/**
 * Détermine si une erreur est due à un problème d'authentification
 * @param error - L'erreur à analyser
 * @returns true si c'est un problème d'auth
 */
export function isAuthError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  const statusCode = getErrorStatusCode(error)
  
  return statusCode === 401 || 
         statusCode === 403 || 
         message.includes('unauthorized') || 
         message.includes('forbidden') || 
         message.includes('invalid credentials') ||
         message.includes('token')
}

/**
 * Formatage d'erreur pour les formulaires avec validation
 * @param error - L'erreur à traiter
 * @param fieldName - Le nom du champ concerné
 * @returns Message d'erreur formaté pour un champ spécifique
 */
export function getFieldErrorMessage(error: unknown, fieldName: string): string {
  const message = getErrorMessage(error)
  
  // Si le message contient déjà le nom du champ, le retourner tel quel
  if (message.toLowerCase().includes(fieldName.toLowerCase())) {
    return message
  }
  
  // Sinon, préfixer avec le nom du champ
  return `${fieldName}: ${message}`
}