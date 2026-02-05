'use client'

import { signOut } from 'next-auth/react'
import { useEffect } from 'react'

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: '/auth/login' })
  }, [])

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Saindo...</span>
        </div>
        <p className="mt-3">Saindo...</p>
      </div>
    </div>
  )
}
