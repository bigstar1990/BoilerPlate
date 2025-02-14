'use server'

import { cookies } from 'next/dist/server/request/cookies'

export async function saveCookies(account_id: string) {
  const cookieStore = cookies()

  ;(await cookieStore).set({
    value: account_id,
    name: 'account_id',
  })

  return { success: true }
}
