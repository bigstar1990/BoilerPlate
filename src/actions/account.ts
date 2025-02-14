'use server'

import { revalidatePath } from 'next/cache'

import {
  getAccounts as getAccountsDB,
  getAccount,
  getAccountWithCampaigns,
  getAccountAdmin as getAccountAdminDB,
  updateAccountStatus,
  createAccount as createAccountDB,
  getAllAccounts,
} from '@/lib/db/account'

import { verifUser } from '@/lib/utils/verifyUser'
import Account from '@/types/account'
import { createUser } from '@/lib/db/users'
import { hash } from '@/lib/utils/hash'

const license = process.env.CRON_MANAGER_LICENSE
const NEXTAUTH_URL = process.env.NEXTAUTH_URL

export async function createAccountAdmin({
  name,
  username,
  password,
  createAsUser,
  status,
  createdBy,
  userParent,
}: {
  name: string
  username: string
  password: string
  createAsUser: boolean
  status: string
  createdBy: string
  userParent: string
}): Promise<{
  success: boolean
  message: string
}> {
  try {
    const { success, user, res } = await verifUser('admin')

    if (!success || !user) return res

    const credentials = { username, password }

    let owner = user.username

    if (createAsUser) {
      const { ok, error } = await createUser({
        username,
        password: await hash(password),
        role: 'user',
        parent: userParent,
      })
      console.log(ok, error)

      if (!ok) return { success: false, message: error }

      owner = username
    }

    const { ok, id } = await createAccountDB({
      credentials,
      owner,
      name,
      status: 'synchronizing',
      createdBy: createdBy,
      asUser: createAsUser,
    })

    if (!ok || !id) return { success: false, message: 'Error creating account' }

    revalidatePath('/')

    return { success: true, message: 'Account created' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Error creating account' }
  }
}

export async function getAllAccountsAdmin(): Promise<{
  success: boolean
  accounts: Account[]
  message?: string
}> {
  try {
    const { success, user, res } = await verifUser('admin')

    if (!success || !user) return res

    const { accounts } = await getAllAccounts()

    if (!accounts) return { success: false, message: 'No accounts found', accounts: [] }

    return { success: true, accounts }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error getting accounts from database',
      accounts: [],
    }
  }
}

export async function getAccountAdmin(account_id?: string): Promise<{
  success: boolean
  account?: any
  message?: string
}> {
  try {
    const { success, user, res } = await verifUser('user')

    if (!success || !user) return res

    const { account } = await getAccountWithCampaigns({
      account_id: account_id || '',
    })

    if (!account) return { success: false, message: 'No accounts found' }

    if (account.owner !== user.username && account.createdBy !== user.username)
      return { success: false, message: 'No accounts found' }

    return { success: true, account }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Error getting accounts from database' }
  }
}

export async function getAccounts(): Promise<{
  success: boolean
  accounts: Account[]
  message?: string
}> {
  try {
    const { success, user, res } = await verifUser('user')
    if (!success || !user) return res

    const { accounts } = await getAccountsDB({ owner: user.username })

    if (!accounts) return { success: false, message: 'No accounts found', accounts: [] }

    return { success: true, accounts }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error getting accounts from database',
      accounts: [],
    }
  }
}

export async function deleteAccountAdmin({
  account_id,
}: {
  account_id: string
}): Promise<{
  success: boolean
  message?: string
}> {
  try {
    const { success, user, res } = await verifUser('admin')

    if (!success || !user) return res
    console.log('deleteAccountAdmin', account_id)

    const { account } = await getAccountAdminDB({ account_id })

    if (!account) return { success: false, message: 'No accounts found' }
    console.log('deleteAccountAdmin', account_id, account)

    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Error deleting account' }
  }
}

export async function deleteAccount(account_id: string): Promise<{
  success: boolean
  message?: string
}> {
  try {
    const { success, user, res } = await verifUser('user')

    if (!success || !user) return res

    const { account } = await getAccount({ account_id })

    if (!account || account.createdBy !== user.username)
      return { success: false, message: 'No accounts found' }

    const { ok } = await updateAccountStatus({ account_id, status: 'deleted' })

    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Error deleting account' }
  }
}
