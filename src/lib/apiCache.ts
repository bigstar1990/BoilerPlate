import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export function withApiCache(
  handler: Function,
  options: {
    revalidate: number
    private?: boolean
  }
) {
  return async function (...args: any[]) {
    const response = await handler(...args)

    if (response instanceof NextResponse) {
      const headersList = await headers()
      const cacheControl = options.private
        ? `private, max-age=${options.revalidate}`
        : `public, s-maxage=${options.revalidate}, stale-while-revalidate`

      response.headers.set('Cache-Control', cacheControl)
      // Add Vary header if needed
      if (headersList.has('Accept-Language')) {
        response.headers.append('Vary', 'Accept-Language')
      }
    }

    return response
  }
}
