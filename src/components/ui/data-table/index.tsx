'use client'
import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { CalendarDatePicker } from '@/components/ui/calendarDatePicker'
import Paginator from './paginator'
import { Separator } from '@/components/shadcn/separator'
import { date } from 'zod'
import { DateRange } from '../dateRange'
import { getDefaultDate } from '@/lib/utils/searchParams'
import BetterSelect from '../data-filter/betterSelect'
import item from '@/types/ui/item'
import { DataTableViewOptions } from './DataTableViewOptions'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  extraFilters?: Array<{
    header: any
    accessorKey: string
    options: item[]
    default?: string | string[]
    multiple?: boolean
  }>
  refresh: (data: any) => void
}
export function DataTable<TData, TValue>({
  columns,
  data,
  extraFilters,
  refresh,
}: DataTableProps<TData, TValue>) {
  const [filterColName, setFilterColName] = React.useState('')
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const [selectedDateRange, setSelectedDateRange] = React.useState({
    from: getDefaultDate(searchParams).from,

    to: getDefaultDate(searchParams).to,
  })
  const search = Object.fromEntries(searchParams)

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [extraFiltersState, setExtraFiltersState] = React.useState<any>(
    extraFilters
      ? Object.fromEntries(
          extraFilters.map((filter) =>
            filter.default
              ? [filter.accessorKey, filter.default]
              : [filter.accessorKey, []]
          )
        )
      : {}
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updater) => {
      console.log(updater)
      setSorting(updater)
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
      sorting,
      columnFilters,
    },
  })

  const colData = table.getAllColumns().map((itm) => {
    return { value: itm.id, text: itm.id }
  })

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex items-center justify-start space-x-4'>
        <div className='flex flex-col justify-items-start space-y-4'>
          <Select
            onValueChange={(value) => {
              console.log(value)
              table?.getColumn(filterColName)?.setFilterValue('')
              setFilterColName(value)
            }}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filter By' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Search filter </SelectLabel>
                <Separator className='my-1 mb-2' />
                <SelectItem key='none' value='none'>
                  None
                </SelectItem>
                {colData.map((itm) => {
                  return (
                    <SelectItem key={itm.value} value={itm.value}>
                      {itm.text}
                    </SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          {filterColName != '' && filterColName != 'none' ? (
            <>
              <Input
                className='w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none'
                placeholder={`Filter by ${filterColName}...`}
                value={
                  (table?.getColumn(filterColName)?.getFilterValue() as string) || ''
                }
                onChange={(event) => {
                  console.log(event.target.value)
                  table?.getColumn(filterColName)?.setFilterValue(event.target.value)
                }}
              />
              <div>
                {table?.getColumn(filterColName)?.getFilterValue() &&
                table?.getColumn(filterColName)?.getFilterValue() != '' ? (
                  <Button
                    className='absolute right-5 top-1/2 h-1/4 w-1 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                    onClick={() => {
                      table?.getColumn(filterColName)?.setFilterValue('')
                    }}
                  >
                    <X size={16} />
                  </Button>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
        <CalendarDatePicker
          date={selectedDateRange}
          onDateSelect={setSelectedDateRange}
        />

        {extraFilters?.map((filter: any, i: number) => {
          return (
            <BetterSelect
              key={i}
              title={filter.header}
              items={filter.options}
              multiple={filter.multiple}
              selectedItems={extraFiltersState[filter.accessorKey]}
              setSelectedItems={(selectedItems) => {
                table.getColumn(filter.accessorKey)?.setFilterValue(selectedItems)

                setExtraFiltersState((prev: any) => ({
                  ...prev,
                  [filter.accessorKey]: selectedItems,
                }))
              }}
            />
          )
        })}

        <Button
          onClick={() => {
            console.log(extraFiltersState)
            refresh({ extraFiltersState, selectedDateRange })
          }}
        >
          Apply
        </Button>
        <DataTableViewOptions table={table} />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length
            ? `${table.getFilteredSelectedRowModel().rows.length} of{" "}`
            : null}
          {table.getFilteredRowModel().rows.length} row(s)
        </div>
        <div className='flex justify-end'>
          <Paginator
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
            onPageChange={(pageNumber) => table.setPageIndex(pageNumber - 1)}
            showPreviousNext
          />
        </div>
      </div>
    </div>
  )
}
