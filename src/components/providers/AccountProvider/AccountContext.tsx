'use client'

import Account from '@/types/client/account'
import { createContext, useContext } from 'react'

type AccountContextType = {
  account: Account | null
  loading: boolean
  error: string | null
  switchAccount: (id: string) => Promise<void>
}

export const AccountContext = createContext<AccountContextType | undefined>(undefined)

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext)
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider')
  }
  return context
}
