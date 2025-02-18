import { revalidateTag } from 'next/cache'

export const invalidateAccountCache = () => {
  revalidateTag('all-accounts')
  revalidateTag('account-admin')
  revalidateTag('account-campaigns')
}

export const invalidateUserCache = () => {
  revalidateTag('admin-users')
  revalidateTag('auth-user')
  revalidateTag('user-verify')
}
