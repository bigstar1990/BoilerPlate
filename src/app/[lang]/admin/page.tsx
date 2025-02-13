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

type AdminPage =
  | 'accounts'
  | 'transactions'
  | 'schedules'
  | 'customers'
  | 'campaigns'
  | 'users'

export default async function CheckoutChamp_page({
  searchParams,
}: {
  searchParams: any
}) {
  const page = (await searchParams.page) || 'users'

  let users = [] as User[]

  let accounts = [] as Account[]

  switch (page) {
    case 'accounts':
      const { accounts: fetchedAccounts } = await getAllAccountsAdmin()
      accounts = fetchedAccounts
      const { users: fetchedUsers1, success: usersSuccess1 } = await getUsers()
      if (usersSuccess1) users = fetchedUsers1
      break
    case 'users':
      const { users: fetchedUsers2, success: usersSuccess2 } = await getUsers()
      if (usersSuccess2) users = fetchedUsers2
      break
    default:
      break
  }

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
