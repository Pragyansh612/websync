import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  const isLoggedIn = !!session
  const path = req.nextUrl.pathname

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Redirect unauthenticated users from protected routes
  const protectedRoutes = ['/dashboard', '/profile']
  if (!isLoggedIn && protectedRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/login', '/signup', '/dashboard', '/profile']
}