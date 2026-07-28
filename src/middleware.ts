import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for Supabase auth cookie (set by @supabase/ssr on login)
  const hasAuth = request.cookies.getAll().some(c =>
    c.name.startsWith('sb-') && c.name.includes('-auth-token')
  )

  const { pathname } = request.nextUrl

  // Protect dashboard
  if (pathname.startsWith('/dashboard') && !hasAuth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users away from login/signup
  if ((pathname === '/login' || pathname === '/signup') && hasAuth) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
