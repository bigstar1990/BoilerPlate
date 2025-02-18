import { warmCache } from '@/lib/cacheWarmer'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Warm the cache on initial load
  await warmCache()

  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
