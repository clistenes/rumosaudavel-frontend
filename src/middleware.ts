import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import { NextRequestWithAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const token = request.nextauth.token
    const pathname = request.nextUrl.pathname
    
    // Redirecionar raiz / para login ou dashboard apropriado
    if (pathname === '/') {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
      
      const userType = token.type as number
      switch (userType) {
        case 1:
          return NextResponse.redirect(new URL('/inicio', request.url))
        case 2:
          return NextResponse.redirect(new URL('/participante', request.url))
        case 3:
          return NextResponse.redirect(new URL('/empresa', request.url))
        default:
          return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    const userType = token.type as number
    
    // Proteção de rotas Admin
    if ((pathname.startsWith('/inicio') || pathname.startsWith('/adm')) && userType !== 1) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    // Proteção de rotas Participante
    if (pathname.startsWith('/participante') && userType !== 2) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    // Proteção de rotas Empresa
    if (pathname.startsWith('/empresa') && userType !== 3) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const pathname = req.nextUrl.pathname
        
        // Permitir acesso público à rota raiz (o middleware vai redirecionar)
        if (pathname === '/') return true
        
        // Permitir acesso às rotas de auth
        if (pathname.startsWith('/auth')) return true
        
        if (!token) return false
        
        const userType = token.type as number
        
        if (pathname.startsWith('/inicio') && userType !== 1) return false
        if (pathname.startsWith('/adm') && userType !== 1) return false
        if (pathname.startsWith('/participante') && userType !== 2) return false
        if (pathname.startsWith('/empresa') && userType !== 3) return false
        
        return true
      },
    },
    pages: {
      signIn: '/auth/login',
    },
  }
)

export const config = {
  matcher: ['/', '/inicio/:path*', '/adm/:path*', '/participante/:path*', '/empresa/:path*'],
}
