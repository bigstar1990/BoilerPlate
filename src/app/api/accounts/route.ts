import { unstable_cache } from 'next/cache'
import { NextResponse } from 'next/server'
import { getAccountWithCampaigns } from '@/lib/db/account'
import { cacheManager } from '@/lib/cacheManager'

const getCachedAccountWithCampaigns = unstable_cache(
  async (accountId: string) => {
    return await getAccountWithCampaigns({ account_id: accountId })
  },
  ['account-campaigns'],
  { revalidate: 300 } // 5 minutes cache for campaign data
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('account_id')

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 })
    }

    const { account, error } = await cacheManager.cache(
      `account-${accountId}`,
      async () => {
        return await getCachedAccountWithCampaigns(accountId)
      }
    )

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ account })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
