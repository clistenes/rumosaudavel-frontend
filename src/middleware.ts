import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import type { NextRequestWithAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const token = request.nextauth.token
    const pathname = request.nextUrl.pathname
    
    console.log('🛡️ [Middleware] Path:', pathname)
    console.log('🛡️ [Middleware] Token:', token ? { type: token.type, id: token.id } : 'null')
    
    // Se acessar a raiz /, redirecionar baseado na autenticação
    if (pathname === '/') {
      // Se não estiver logado, vai para login
      if (!token) {
        console.log('🛡️ [Middleware] Sem token, redirecionando para login')
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
      
      // Se estiver logado, redireciona baseado no tipo de usuário
      const userType = Number(token.type)
      console.log('🛡️ [Middleware] Tipo de usuário:', userType, typeof token.type)
      
      switch (userType) {
        case 1: // Admin
          console.log('🛡️ [Middleware] Admin → /inicio')
          return NextResponse.redirect(new URL('/inicio', request.url))
        case 2: // Participante
          console.log('🛡️ [Middleware] Participante → /participante')
          return NextResponse.redirect(new URL('/participante', request.url))
        case 3: // Empresa
          console.log('🛡️ [Middleware] Empresa → /empresa')
          return NextResponse.redirect(new URL('/empresa', request.url))
        default:
          console.log('🛡️ [Middleware] Tipo desconhecido:', userType)
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
