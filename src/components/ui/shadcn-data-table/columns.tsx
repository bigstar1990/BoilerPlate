import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/shadcn/badge'
import { Checkbox } from '@/components/shadcn/checkbox'

import { labels, priorities, statuses } from './data'
import { Task } from './schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { TableHeader } from '@/components/shadcn/table'
import { Label } from '@/components/shadcn/label'
import { getNestedValue } from '@/lib/utils/getNestedValue'
import { title } from 'process'

export type CustomColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  enableFiltering?: boolean
  filtering?: {
    options: { label: string; value: string; icon?: React.FC }[]
  }
  title: string
  accessorKey: string
  cell?: any
  filterFn?: any
  hide?: boolean
  enableHiding?: boolean
  enableSearching?: boolean
  enableSorting?: boolean
  name: string
  type: string
}

export function baseFilterFn(row: any, id: string, value: string | string[]) {
  console.log(
    row,
    id,
    value,
    value.includes(getNestedValue(row.original, id)),
    getNestedValue(row.original, id)
  )

  if (!value || typeof value === 'undefined') return true
  if (typeof value === 'string')
    return (
      getNestedValue(row.original, id)
        ?.toString()
        ?.toLowerCase()
        .startsWith(value.toString().toLowerCase()) || false
    )
  if (value.length === 0) return true
  else return value.includes(getNestedValue(row.original, id))
}
export type columnsObjType = {
  name: string
  type: string
  title: string
  enableSorting?: boolean
  enableHiding?: boolean
  hide: boolean
  enableSearching?: boolean
  accessor?: string
  cell?: any
  filterFn?: any
  enableFiltering?: boolean
  filtering?: any
}

// const columnsObj: columnsObjType[] = [
//   {
//     name: 'id',
//     type: 'id',
//     title: 'Task',
//     enableSorting: false,
//     enableHiding: false,
//     enableSearching: true,
//   },
//   {
//     name: 'title',
//     type: 'string',
//     title: 'Title',
//     enableSorting: true,
//     enableHiding: true,

//     enableSearching: true,
//     cell: ({ row }: any) => {
//       const label = labels.find((label) => label.value === row.original.label)

//       return (
//         <div className='flex space-x-2'>
//           {label && <Badge variant='outline'>{label.label}</Badge>}
//           <span className='max-w-[500px] truncate font-medium'>
//             {row.getValue('title')}
//           </span>
//         </div>
//       )
//     },
//   },
//   {
//     name: 'status',
//     type: 'string',
//     title: 'Status',
//     enableSorting: true,
//     enableHiding: true,
//     enableSearching: true,
//     cell: ({ row }: any) => {
//       const status = statuses.find((status) => status.value === row.getValue('status'))

//       if (!status) {
//         return null
//       }

//       return (
//         <div className='flex w-[100px] items-center'>
//           {status.icon && <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />}
//           <span>{status.label}</span>
//         </div>
//       )
//     },
//     enableFiltering: true,
//     filtering: { options: statuses },
//   },
//   {
//     name: 'priority',
//     type: 'string',
//     title: 'Priority',

//     enableSorting: true,
//     enableHiding: true,
//     enableSearching: true,
//     cell: ({ row }: any) => {
//       const priority = priorities.find(
//         (priority) => priority.value === row.getValue('priority')
//       )

//       if (!priority) {
//         return null
//       }

//       return (
//         <div className='flex items-center'>
//           {priority.icon && (
//             <priority.icon className='mr-2 h-4 w-4 text-muted-foreground' />
//           )}
//           <span>{priority.label}</span>
//         </div>
//       )
//     },
//     enableFiltering: true,
//     filtering: { options: priorities },
//   },
//   {
//     name: 'actions',
//     type: 'actions',
//     title: 'Actions',
//     enableSorting: false,
//     enableHiding: false,
//     enableSearching: false,
//   },
// ]

export function getColumnnnDef(columnsObj: columnsObjType[]): any {
  const columns: any[] = []
  for (let i = 0; i < columnsObj.length; i++) {
    const item = columnsObj[i]
    if (item.type === 'id') {
      columns.push(getIdColumnDef(item))
    } else if (item.type === 'string') {
      columns.push(getStringColumnDef(item))
    } else if (item.type === 'actions') {
      columns.push(getActionsColumnDef(item))
    } else if (item.type === 'boolean') {
      columns.push(getBooleanColumnDef(item))
    } else if (item.type === 'select') {
      columns.push(getSelectColumnDef(item))
    } else if (item.type === 'date') {
      columns.push(getDateColumnDef(item))
    } else if (item.type === 'number') {
      columns.push(getNumberColumnDef(item))
    }
  }
  return columns
}

function getIdColumnDef(item: columnsObjType) {
  return {
    accessorKey: item?.accessor?.toString() || item.name.toString(),
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title={item.title} />
    ),
    cell: ({ row }: any) => (
      <div className='w-[80px]'>{row.getValue(item?.accessor || item.name)}</div>
    ),
    title: item.title,
    enableSorting: item.enableSorting,
    enableHiding: item.enableHiding,
    hide: item.hide,
    enableSearching: item.enableSearching,
    filterFn: item.filterFn ? item.filterFn : baseFilterFn,
  }
}

function getNumberColumnDef(item: columnsObjType) {
  return {
    accessorKey: item?.accessor?.toString() || item.name.toString(),
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title={item.title} />
    ),
    cell: ({ row }: any) => (
      <div className='w-[80px]'>{row.getValue(item?.accessor || item.name)}</div>
    ),
    enableSorting: item.enableSorting,
    enableHiding: item.enableHiding,
    hide: item.hide,
    enableSearching: item.enableSearching,
    filterFn: item.filterFn ? item.filterFn : baseFilterFn,
  }
}

function getDateColumnDef(item: columnsObjType) {
  return {
    accessorKey: item?.accessor?.toString() || item.name.toString(),
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title={item.title} />
    ),
    cell: ({ row }: any) => (
      <div className='w-[80px]'>{row.getValue(item?.accessor || item.name)}</div>
    ),
    enableSorting: item.enableSorting,
    enableHiding: item.enableHiding,
    hide: item.hide,
    enableSearching: item.enableSearching,
    filterFn: item.filterFn ? item.filterFn : baseFilterFn,
  }
}

function getStringColumnDef(item: columnsObjType) {
  return {
    accessorKey: item?.accessor?.toString() || item.name.toString(),
    title: item.title,
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title={item.title} />
    ),
    cell:
      item?.cell ||
      (({ row }: any) => {
        return getNestedValue(row.original, item?.accessor || item.name).toString()
      }),
    enableSorting: item.enableSorting,
    enableHiding: item.enableHiding,
    enableSearching: item.enableSearching,
    hide: item.hide,
    enableFiltering: item.enableFiltering,
    filterFn: item.filterFn ? item.filterFn : baseFilterFn,
    filtering: item.filtering,
  }
}

function getActionsColumnDef(item: columnsObjType) {
  return {
    id: 'actions',
    cell: item.cell,
  }
}

function getBooleanColumnDef(item: columnsObjType) {
  return {
    title: item.title,
    accessorKey: item?.accessor?.toString() || item.name.toString(),
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title={item.title} />
    ),
    cell:
      item?.cell ||
      (({ row }: any) => {
        return getNestedValue(row.original, item?.accessor || item.name)
      }),
    enableSorting: item.enableSorting,
    enableHiding: item.enableHiding,
    enableSearching: item.enableSearching,
    hide: item.hide,
    enableFiltering: item.enableFiltering,
    filterFn: item?.filterFn ? item.filterFn : baseFilterFn,
    filtering: item.filtering
      ? item.filtering
      : {
          options: [
            { label: 'true', value: true },
            { label: 'false', value: false },
          ],
        },
  }
}

function getSelectColumnDef(item: columnsObjType) {
  return {
    id: 'select',
    header: ({ table }: any) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

// export const columnfs: CustomColumnDef<Task, unknown>[] = [
//   {
//     id: 'select',
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && 'indeterminate')
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label='Select all'
//         className='translate-y-[2px]'
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label='Select row'
//         className='translate-y-[2px]'
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: 'id',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Task' />,
//     cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
//     enableSorting: false,
//     enableHiding: false,
//     enableSearching: true,
//   },
//   {
//     accessorKey: 'title',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Title' />,
//     cell: ({ row }) => {
//       const label = labels.find((label) => label.value === row.original.label)

//       return (
//         <div className='flex space-x-2'>
//           {label && <Badge variant='outline'>{label.label}</Badge>}
//           <span className='max-w-[500px] truncate font-medium'>
//             {row.getValue('title')}
//           </span>
//         </div>
//       )
//     },
//     enableSearching: true,
//   },
//   {
//     accessorKey: 'status',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
//     cell: ({ row }) => {
//       const status = statuses.find((status) => status.value === row.getValue('status'))

//       if (!status) {
//         return null
//       }

//       return (
//         <div className='flex w-[100px] items-center'>
//           {status.icon && <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />}
//           <span>{status.label}</span>
//         </div>
//       )
//     },
//     filterFn: baseFilterFn,
//     enableFiltering: true,
//     filtering: {
//       options: statuses,
//     },
//   },
//   {
//     accessorKey: 'priority',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Priority' />,
//     cell: ({ row }) => {
//       const priority = priorities.find(
//         (priority) => priority.value === row.getValue('priority')
//       )

//       if (!priority) {
//         return null
//       }

//       return (
//         <div className='flex items-center'>
//           {priority.icon && (
//             <priority.icon className='mr-2 h-4 w-4 text-muted-foreground' />
//           )}
//           <span>{priority.label}</span>
//         </div>
//       )
//     },
//     filterFn: baseFilterFn,
//     filtering: {
//       options: priorities,
//     },
//     enableFiltering: true,
//     enableSearching: true,
//   },
//   {
//     id: 'actions',
//     cell: ({ row }) => (
//       <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
//     ),
//   },
// ]
