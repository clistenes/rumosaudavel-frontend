'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedTypes?: number[]
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  allowedTypes = [],
  redirectTo = '/auth/login'
}: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      const callbackUrl = pathname || '/'
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(callbackUrl)}`)
      return
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(session.user?.type)) {
      // Redirect to appropriate dashboard based on user type
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
          router.push(redirectTo)
      }
    }
  }, [session, status, router, pathname, allowedTypes, redirectTo])

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(session.user?.type)) {
    return null
  }

  return <>{children}</>
}
