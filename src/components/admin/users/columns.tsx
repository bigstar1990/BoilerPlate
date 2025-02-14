import { FieldConfig } from '@/components/ui/better-form'
import { columnsObjType } from '@/components/ui/shadcn-data-table/columns'
import { DataTableRowActions } from '@/components/ui/shadcn-data-table/data-table-row-actions'

import User from '@/types/user'

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
        return [
          { id: 'admin', name: 'Admin' },
          { id: 'user', name: 'User' },
          { id: 'super-admin', name: 'Super Admin' },
        ]
      },
      multiple: false,
    },
  } as Record<string, FieldConfig>
  if (users.length > 0) {
    fieldConfigs['parent'] = {
      type: 'betterSelect',
      options: async (data) => {
        return users.map((user) => ({ id: user.username, name: user.username }))
      },
      multiple: false,
      necessary: false,
    }
  }
  return fieldConfigs
}
