import { FieldConfig } from '@/components/ui/better-form'
import { columnsObjType } from '@/components/ui/shadcn-data-table/columns'
import { DataTableRowActions } from '@/components/ui/shadcn-data-table/data-table-row-actions'
import User from '@/types/user'

export default function getAccountColumnDef(
  onEdit: any,
  onDelete: any
): columnsObjType[] {
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
      name: 'name',
      type: 'string',
      accessor: 'name',
      enableSorting: true,
      enableHiding: true,
      hide: false,
      enableSearching: true,
      title: 'Name',
    },
    {
      name: 'owner',
      type: 'string',
      accessor: 'owner',
      enableSorting: true,
      enableHiding: true,
      hide: false,
      enableSearching: true,
      title: 'Owner',
    },
    {
      name: 'createdBy',
      type: 'string',
      accessor: 'createdBy',
      enableSorting: true,
      enableHiding: true,
      hide: false,
      enableSearching: true,
      title: 'Created By',
    },
    {
      name: 'status',
      type: 'string',
      accessor: 'status',
      enableSorting: true,
      enableHiding: true,
      hide: false,
      enableSearching: true,
      title: 'Status',
    },
    {
      name: 'actions',
      title: 'Actions',
      hide: false,
      type: 'actions',
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
  const fieldConfigs: Record<string, FieldConfig> = {
    name: {
      type: 'text',
    },
    owner: {
      type: 'betterSelect',
      options: async (data: any) => {
        return users.map((user) => ({
          id: user.username,
          name: user.username,
        }))
      },
    },
    username: {
      type: 'text',
      accessor: (data: any) => data?.credentials?.username || '',
    },
    password: {
      type: 'text',
      accessor: (data: any) => data?.credentials?.password || '',
    },
    createdBy: {
      type: 'betterSelect',
      options: async (data: any) => {
        return users.map((user) => ({
          id: user.username,
          name: user.username,
        }))
      },
    },
    status: {
      type: 'select',
      options: async (data: any) => {
        return [
          { id: 'active', name: 'Active' },
          { id: 'inactive', name: 'Inactive' },
          { id: 'deleted', name: 'Deleted' },
          { id: 'pending', name: 'Pending' },
        ]
      },
    },
    asUser: {
      type: 'boolean',
    },
  }
  return fieldConfigs
}
