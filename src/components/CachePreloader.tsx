'use client'

import { useEffect } from 'react'
import { cacheManager } from '@/lib/cacheManager'

export function CachePreloader({
  initialData,
  cacheKey,
}: {
  initialData: any
  cacheKey: string
}) {
  useEffect(() => {
    // Preload data into cache
    cacheManager.cache(cacheKey, async () => initialData, {
      revalidate: 60,
    })
  }, [initialData, cacheKey])

  return null
}
