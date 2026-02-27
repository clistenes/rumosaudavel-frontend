'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface RoleGuardProps {
  children: React.ReactNode
  allowedTypes: number[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedTypes, fallback }: RoleGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    if (!allowedTypes.includes(session.user?.type)) {
      // Redirect to appropriate dashboard
      switch (session.user?.type) {
        case 1:
          router.push('/inicio')
          break
        case 2:
          router.push('/participante')
          break
        case 3:
          router.push('/empresa')
          break
        default:
          router.push('/auth/login')
      }
    }
  }, [session, status, router, allowedTypes])

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  if (!session || !allowedTypes.includes(session.user?.type)) {
    if (fallback) {
      return <>{fallback}</>
    }
    return null
  }

  return <>{children}</>
}
