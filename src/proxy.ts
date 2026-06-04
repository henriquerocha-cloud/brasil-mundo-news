import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Se for a página de login do admin, deixar passar
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Se for qualquer outra rota de admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = request.cookies.get('admin_session')
    
    // Se não tiver a sessão válida, redireciona para o login
    if (!session || session.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
}
