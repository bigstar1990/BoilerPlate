import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function withCache(handler: Function, options: { revalidate: number }) {
  return async function (request: NextRequest) {
    const response = await handler(request)

    if (response instanceof NextResponse) {
      // Add cache headers
      response.headers.set('Cache-Control', `s-maxage=${options.revalidate}`)
    }

    return response
  }
}
