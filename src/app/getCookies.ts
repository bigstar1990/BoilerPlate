'use server'

import { cookies } from 'next/headers'

export async function getCookies() {
  const cookieStore = cookies()
  const account_id = (await cookieStore).get('account_id')?.value
  return { account_id }
}
