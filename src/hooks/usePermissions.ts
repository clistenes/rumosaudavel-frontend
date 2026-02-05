'use client'

import { useSession } from 'next-auth/react'

export function useIsAdmin() {
  const { data: session } = useSession()
  return session?.user?.type === 1
}

export function useIsParticipante() {
  const { data: session } = useSession()
  return session?.user?.type === 2
}

export function useIsEmpresa() {
  const { data: session } = useSession()
  return session?.user?.type === 3
}

export function useHasRole(roles: number[]) {
  const { data: session } = useSession()
  return roles.includes(session?.user?.type || 0)
}

export function useUserType() {
  const { data: session } = useSession()
  return session?.user?.type
}
