'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()
  
  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    login: signIn,
    logout: signOut,
  }
}

export function useUser() {
  const { data: session } = useSession()
  return session?.user
}

export function useIsAuthenticated() {
  const { status } = useSession()
  return status === 'authenticated'
}
