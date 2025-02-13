'use client'

import React, { useState, useEffect } from 'react'
import { AccountContext } from './AccountContext'
import { getAccountAdmin } from '@/actions/account'
import type { Accounts } from '@/types'
import Account from '@/types/client/account'
import { cookies } from 'next/headers'
import { saveCookies } from '@/app/saveCookies'

export const AccountProvider = ({
  children,
  accounts: initialAccounts,
  session,
}: {
  accounts: Account[]
  children: React.ReactNode
  session: any
}) => {
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts)
  console.log(account)
  // Charger le compte initial
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        if (!session || !session.user || !accounts || accounts?.length === 0) return
        setLoading(true)
        setError(null)

        // Vérifiez si les comptes sont déjà stockés dans le localStorage
        const storedAccounts = localStorage.getItem('accounts')
        if (storedAccounts) {
          const parsedAccounts = JSON.parse(storedAccounts)
          setAccounts(parsedAccounts)

          // Vérifiez si un compte est sélectionné dans le localStorage
          const selectedAccount = localStorage.getItem('selectedAccount')
          if (selectedAccount) {
            console.log('selectedAccount', JSON.parse(selectedAccount))
            setAccount(JSON.parse(selectedAccount))
          }
        } else {
          // Si les comptes ne sont pas dans le localStorage, chargez-les depuis le serveur
          const { account } = await getAccountAdmin(initialAccounts[0].id)
          console.log('account', account)
          if (account) {
            setAccount(account)
            setAccounts(initialAccounts)
            localStorage.setItem('accounts', JSON.stringify(initialAccounts))
            localStorage.setItem('selectedAccount', JSON.stringify(account))
            saveCookies(account.id)
          }
        }
        setLoading(false)
      } catch (err: any) {
        setError(err.message || 'Failed to load account')
      } finally {
        setLoading(false)
      }
    }

    fetchAccount()
  }, [initialAccounts, session])

  // Gestion du changement de compte
  const switchAccount = async (newAccountId: string) => {
    try {
      setLoading(true)
      const accountData = await getAccountAdmin(newAccountId)
      console.log('accountData', accountData)
      if (!accountData.account) {
        throw new Error('Account not found')
      }
      saveCookies(accountData.account.id)
      setAccount(accountData.account)
      localStorage.setItem('selectedAccount', JSON.stringify(accountData.account))
    } catch (err: any) {
      console.log('err', err)
      setError(err.message || 'Failed to switch account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AccountContext.Provider value={{ account, loading, error, switchAccount }}>
      {children}
    </AccountContext.Provider>
  )
}
