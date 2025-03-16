import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDataFromToken } from '@/helpers/getDataFromToken'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/login' || path === '/signup'

  const token = request.cookies.get('token')?.value || ''

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  if (!isPublicPath) {
    try {
      const userData = await getDataFromToken(token) // Validate JWT
      if (!userData) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
  }
}

export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup',
    '/chatAI', // ✅ Protects ChatAI
  ]
}
