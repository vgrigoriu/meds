import { auth } from '@/auth'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const session = await auth()
  const isLoggedIn = !!session

  const pathname = request.nextUrl.pathname
  const isOnLogin = pathname === '/login'
  const isOnRoot = pathname === '/'

  // Redirect root to appropriate page
  if (isOnRoot) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/inventory', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from login
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL('/inventory', request.url))
  }

  // Protect inventory route
  if (!isLoggedIn && !isOnLogin) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.svg).*)'],
}
