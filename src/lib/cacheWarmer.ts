import { getUsers } from '@/lib/db/users'
import { getAllAccounts } from '@/lib/db/account'

export async function warmCache() {
  try {
    // Warm up frequently accessed data
    await Promise.all([getUsers(), getAllAccounts()])

    console.log('Cache warmed successfully')
  } catch (error) {
    console.error('Error warming cache:', error)
  }
}

// Schedule the cache warmup
if (process.env.NODE_ENV === 'production') {
  warmCache()
}
