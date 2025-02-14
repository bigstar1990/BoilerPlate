'use client'

import React from 'react'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/shadcn/select'
import { useAccount } from './AccountContext'
import Account from '@/types/account'

export const AccountSelect = ({ accounts }: { accounts: Account[] }) => {
  const { account, switchAccount, loading } = useAccount()

  if (loading) return <div>Loading...</div>
  console.log('accounts', accounts, account)

  return (
    <Select
      onValueChange={(id) => {
        console.log('id', id)

        switchAccount(id).then(() => {
          // window.location.reload()
        })
      }}
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
