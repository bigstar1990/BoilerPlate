type CacheDebugOptions = {
  enabled: boolean
  logLevel: 'info' | 'debug' | 'warn' | 'error'
}

class CacheDebug {
  private static instance: CacheDebug
  private options: CacheDebugOptions = {
    enabled: process.env.NODE_ENV === 'development',
    logLevel: 'info',
  }

  private constructor() {}

  static getInstance() {
    if (!CacheDebug.instance) {
      CacheDebug.instance = new CacheDebug()
    }
    return CacheDebug.instance
  }

  setOptions(options: Partial<CacheDebugOptions>) {
    this.options = { ...this.options, ...options }
  }

  logCacheHit(key: string, data: any) {
    if (!this.options.enabled) return
    console.log(`🎯 Cache HIT for key: ${key}`, data)
  }

  logCacheMiss(key: string) {
    if (!this.options.enabled) return
    console.log(`❌ Cache MISS for key: ${key}`)
  }

  logCacheSet(key: string, ttl: number) {
    if (!this.options.enabled) return
    console.log(`💾 Cache SET for key: ${key}, TTL: ${ttl}s`)
  }

  logCacheInvalidate(key: string) {
    if (!this.options.enabled) return
    console.log(`🗑️ Cache INVALIDATED for key: ${key}`)
  }
}

export const cacheDebug = CacheDebug.getInstance()
