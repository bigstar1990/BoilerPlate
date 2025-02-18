'use client'

import React, { useCallback } from 'react'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/shadcn/select'
import { useAccount } from './AccountContext'
import Account from '@/types/account'
import { unstable_cache } from 'next/cache'

const getCachedAccount = unstable_cache(
  async (id: string) => {
    const response = await fetch(`/api/accounts/${id}`)
    return response.json()
  },
  ['account-select'],
  { revalidate: 60 }
)

export const AccountSelect = ({ accounts }: { accounts: Account[] }) => {
  const { account, switchAccount, loading } = useAccount()

  const handleAccountSwitch = useCallback(
    async (id: string) => {
      try {
        const cachedAccount = await getCachedAccount(id)
        await switchAccount(id)
      } catch (error) {
        console.error('Error switching account:', error)
      }
    },
    [switchAccount]
  )

  if (loading) return <div>Loading...</div>
  console.log('accounts', accounts, account)

  return (
    <Select
      onValueChange={handleAccountSwitch}
      defaultValue={account?.id || ''}
      value={account?.id || ''}
    >
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select an account' />
      </SelectTrigger>
      <SelectContent>
        {accounts.map((acc) => (
          <SelectItem key={acc.id} value={acc.id}>
            {acc.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
