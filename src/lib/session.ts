import { Usuario, SessionData } from './types'

export function getSession(): Usuario | null {
  try {
    const session = localStorage.getItem('session')
    if (!session) return null

    const sessionData: SessionData = JSON.parse(session)
    if (Date.now() > sessionData.expiresAt) {
      // Si la sesión ha expirado, la eliminamos y devolvemos null
      localStorage.removeItem('session')
      return null
    }

    return sessionData.user
  } catch (error) {
    console.error('Error fetching session:', error)
    return null
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem('session')
  } catch (error) {
    console.error('Error clearing session:', error)
  }
}

export function isSessionActive(): boolean {
  try {
    return getSession() !== null
  } catch (error) {
    console.error('Error checking session activity:', error)
    return false
  }
}
