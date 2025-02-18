import { getAllAccountsAdmin } from '@/actions/account'
import { getUsers } from '@/actions/user'
import AccountsAdminDatatable from '@/components/admin/accounts'
import UsersAdminDatatable from '@/components/admin/users'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/shadcn/navigation-menu'
import Account from '@/types/account'
import User from '@/types/user'
import { unstable_cache } from 'next/cache'

type AdminPage =
  | 'accounts'
  | 'transactions'
  | 'schedules'
  | 'customers'
  | 'campaigns'
  | 'users'

// Cache the user fetching for 60 seconds
const getCachedUsers = unstable_cache(
  async () => {
    const { users } = await getUsers()
    return users
  },
  ['admin-users'],
  { revalidate: 60 }
)

// Cache the accounts fetching for 60 seconds
const getCachedAccounts = unstable_cache(
  async () => {
    const { accounts } = await getAllAccountsAdmin()
    return accounts
  },
  ['admin-accounts'],
  { revalidate: 60 }
)

export default async function CheckoutChamp_page({
  searchParams,
}: {
  searchParams: any
}) {
  const page = (searchParams?.page || 'users') as AdminPage

  // Use cached functions
  const users = await getCachedUsers()
  const accounts = await getCachedAccounts()

  return (
    <div className='m-6 flex w-full flex-col'>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href='/admin?page=users'
          >
            Users
          </NavigationMenuLink>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href='/admin?page=accounts'
          >
            Accounts
          </NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>
      {page === 'users' && <UsersAdminDatatable users={users} />}
      {page === 'accounts' && (
        <AccountsAdminDatatable accounts={accounts} users={users} />
      )}
    </div>
  )
}
