import { FieldConfig } from '@/components/ui/better-form'
import { columnsObjType } from '@/components/ui/shadcn-data-table/columns'
import { DataTableRowActions } from '@/components/ui/shadcn-data-table/data-table-row-actions'
import { unstable_cache } from 'next/cache'

import User from '@/types/user'

// Cache role options
const getCachedRoleOptions = unstable_cache(
  async () => {
    return [
      { id: 'admin', name: 'Admin' },
      { id: 'user', name: 'User' },
      { id: 'super-admin', name: 'Super Admin' },
    ]
  },
  ['role-options'],
  { revalidate: 3600 } // Cache for 1 hour since these rarely change
)

export default function getUserColumnDef(onEdit: any, onDelete: any): columnsObjType[] {
  return [
    {
      name: 'id',
      type: 'id',
      accessor: 'id',
      enableSorting: false,
      enableHiding: true,
      hide: true,
      enableSearching: false,
      title: 'ID',
    },
    {
      name: 'username',
      type: 'string',
      hide: false,
      accessor: 'username',
      enableSorting: true,
      enableHiding: true,
      enableSearching: true,
      title: 'Username',
    },
    {
      name: 'password',
      type: 'string',
      accessor: 'password',
      enableSorting: false,
      enableHiding: true,
      enableSearching: false,
      hide: false,
      title: 'Password',
    },
    {
      name: 'role',
      type: 'string',
      accessor: 'role',
      enableSorting: true,
      enableHiding: true,
      enableSearching: true,
      hide: false,
      title: 'Role',
    },
    {
      name: 'createdAt',
      type: 'date',
      accessor: 'createdAt',
      enableSorting: true,
      enableHiding: true,
      hide: false,
      enableSearching: false,
      title: 'Created At',
    },
    {
      name: 'parent',
      type: 'string',
      hide: false,
      accessor: 'parent',
      enableSorting: true,
      enableHiding: true,
      enableSearching: true,
      title: 'Parent',
    },
    {
      name: 'actions',
      title: 'Actions',
      type: 'actions',
      hide: false,
      cell: (row: any) => {
        return <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
      },
    },
  ]
}

// Cache user options
const getCachedUserOptions = unstable_cache(
  async (users: User[]) => {
    return users.map((user) => ({
      id: user.username,
      name: user.username,
    }))
  },
  ['user-select-options'],
  { revalidate: 300 }
)

export function getFieldConfigs({
  users,
}: {
  users: User[]
}): Record<string, FieldConfig> {
  const fieldConfigs = {
    username: { type: 'text' },
    password: { type: 'password' },
    role: {
      type: 'betterSelect',
      options: async (data) => {
        return await getCachedRoleOptions()
      },
      multiple: false,
    },
  } as Record<string, FieldConfig>

  if (users.length > 0) {
    fieldConfigs['parent'] = {
      type: 'betterSelect',
      options: async (data) => {
        return await getCachedUserOptions(users)
      },
      multiple: false,
      necessary: false,
    }
  }
  return fieldConfigs
}
