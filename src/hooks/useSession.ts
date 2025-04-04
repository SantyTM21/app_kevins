// src/hooks/useSession.ts
import { useState, useEffect } from 'react'
import { getSession } from '../lib/session'
import { Usuario } from '@/lib/types'

export function useSession(): Usuario | null {
  const [session, setSession] = useState<Usuario | null>(null)

  useEffect(() => {
    const userSession = getSession()
    setSession(userSession)
  }, []) // Se ejecuta solo al montar el componente en el cliente

  return session
}
