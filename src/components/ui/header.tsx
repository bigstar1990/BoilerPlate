import React from 'react'
import { ThemeToggle } from './themeToggle'
import { Disconnect } from './disconnect'
import { cn } from '@/lib/utils'
import { AccountSelect } from '../providers/AccountProvider/AccountSelect'
import Account from '@/types/account'

const Header = ({ accounts }: { accounts: Account[] }) => {
  return (
    <div className={cn('m-5 flex flex-col items-center justify-end space-y-4')}>
      {/* Sélecteur de compte */}
      <AccountSelect accounts={accounts} />
      <div className='flex w-full'>
        <ThemeToggle />
        <Disconnect />
      </div>
    </div>
  )
}

export default Header
