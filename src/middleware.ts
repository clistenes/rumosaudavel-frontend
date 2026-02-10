import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Permitir acesso a rotas públicas
  if (pathname.startsWith('/auth/') || pathname === '/') {
    return NextResponse.next()
  }
  
  // Para rotas protegidas, deixa o NextAuth/RoleGuard lidar
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
