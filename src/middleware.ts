import {
  NextMiddlewareWithAuth,
  NextRequestWithAuth,
  withAuth,
} from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import setup from '../setup.json'
import locales from '@/localization/locales.json'
import { withCache } from './lib/middlewareCache'

const defaultLocale = 'en'
const nonLocalePaths = ['/api', '/uploads', '/assets']
const privatePaths = ['/']
const adminPaths = ['/admin']

function getLocale(request: NextRequest) {
  const headerLocale = request.headers.get('Accept-Language')
  if (headerLocale && Object.keys(locales).includes(headerLocale)) return headerLocale
  return Object.keys(locales)[0]
}

function middleware(request: NextRequestWithAuth) {
  const { pathname } = request.nextUrl

  // Add caching for static paths
  if (pathname.startsWith('/_next/') || pathname.includes('/static/')) {
    return withCache(
      async () => {
        return NextResponse.next()
      },
      { revalidate: 31536000 }
    ) // Cache for 1 year
  }

  // Vérifier si setup.setup est false et rediriger vers /setup si nécessaire
  if (!setup.setup && pathname.includes('/setup')) {
    request.nextUrl.pathname = `/${getLocale(request)}`
    return NextResponse.redirect(request.nextUrl)
  }

  // Vérifier si setup.setup est true et rediriger vers / si l'utilisateur essaie d'accéder à /setup
  if (setup.setup && !pathname.includes('/setup')) {
    request.nextUrl.pathname = `/${getLocale(request)}/setup`
    return NextResponse.redirect(request.nextUrl)
  }

  // Gestion des locales
  const pathnameHasLocale = Object.keys(locales).some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  request.nextUrl.pathname = `/${getLocale(request)}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export default withAuth(middleware as NextMiddlewareWithAuth, {
  callbacks: {
    authorized: async ({ req, token }) => {
      if (setup.setup === true) {
        return true
      }
      const pathname = req.nextUrl.pathname.replace(`/${getLocale(req)}`, '')
      const firstPath =
        '/' + (pathname.split('/').length > 1 ? pathname.split('/')[1] : '')

      if (privatePaths.includes(firstPath)) {
        if (!token) return false
        const user: any = token?.user
        if (!user) return false
        if (
          user?.role !== 'admin' &&
          user?.role !== 'user' &&
          user?.role !== 'super-admin'
        )
          return false
      }

      if (adminPaths.includes(firstPath)) {
        if (!token) return false
        const user: any = token?.user
        if (!user) return false
        if (user?.role !== 'admin' && user?.role !== 'super-admin') return false
      }

      return true
    },
  },
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
