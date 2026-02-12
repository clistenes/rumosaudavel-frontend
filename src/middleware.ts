import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import type { NextRequestWithAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const token = request.nextauth.token
    const pathname = request.nextUrl.pathname
    
    // Se acessar a raiz /, redirecionar baseado na autenticação
    if (pathname === '/') {
      // Se não estiver logado, vai para login
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
      
      // Se estiver logado, redireciona baseado no tipo de usuário
      const userType = token.type as number
      
      switch (userType) {
        case 1: // Admin
          return NextResponse.redirect(new URL('/inicio', request.url))
        case 2: // Participante
          return NextResponse.redirect(new URL('/participante', request.url))
        case 3: // Empresa
          return NextResponse.redirect(new URL('/empresa', request.url))
        default:
          return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }
    
    // Permitir acesso a rotas de auth sem redirecionamento
    if (pathname.startsWith('/auth/')) {
      return NextResponse.next()
    }
    
    // Para outras rotas protegidas, verificar autenticação
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const pathname = req.nextUrl.pathname
        
        // Sempre permitir acesso à raiz (o middleware vai redirecionar)
        if (pathname === '/') return true
        
        // Permitir acesso às rotas de auth
        if (pathname.startsWith('/auth/')) return true
        
        // Requerer token para outras rotas
        return !!token
      },
    },
    pages: {
      signIn: '/auth/login',
    },
  }
)

export const config = {
  matcher: ['/', '/auth/:path*', '/inicio/:path*', '/adm/:path*', '/participante/:path*', '/empresa/:path*'],
}
