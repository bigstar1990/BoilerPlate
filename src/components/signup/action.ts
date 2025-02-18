'use server'

import { createUser } from '@/lib/db/users'

export async function action(
  username: string,
  password: string
): Promise<{
  ok: boolean
  error?: any
}> {
  const { ok, error } = await createUser({
    username: username,
    password: password,
    role: 'user',
    status: 'Inactive',
    parent: '',
  })
  return { ok, error }
}
