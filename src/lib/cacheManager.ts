import { unstable_cache } from 'next/cache'

type CacheConfig = {
  revalidate: number
  tags?: string[]
}

class CacheManager {
  private static instance: CacheManager
  private cacheConfigs: Map<string, CacheConfig>

  private constructor() {
    this.cacheConfigs = new Map()
  }

  static getInstance() {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  registerCache(key: string, config: CacheConfig) {
    this.cacheConfigs.set(key, config)
  }

  async cache<T>(
    key: string,
    fn: () => Promise<T>,
    config?: Partial<CacheConfig>
  ): Promise<T> {
    const existingConfig = this.cacheConfigs.get(key)
    const finalConfig = {
      ...existingConfig,
      ...config,
    }

    return unstable_cache(fn, [key], { revalidate: finalConfig.revalidate })()
  }

  async invalidate(keys: string[]) {
    // Implementation will depend on needs
    // This is a placeholder for when Next.js provides an API for this
    console.log('Cache invalidation requested for:', keys)
  }
}

export const cacheManager = CacheManager.getInstance()

// Register common caches
cacheManager.registerCache('users', { revalidate: 60, tags: ['users'] })
cacheManager.registerCache('accounts', { revalidate: 60, tags: ['accounts'] })
cacheManager.registerCache('auth', { revalidate: 30, tags: ['auth'] })
