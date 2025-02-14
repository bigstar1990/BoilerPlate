'use client'

import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DataTableViewOptions } from '@/components/ui/data-table/DataTableViewOptions'

import { priorities, statuses } from './data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Separator } from '@/components/shadcn/separator'
import { useState } from 'react'
import { CustomColumnDef } from './columns'
import { Task } from './schema'
import BetterSelect from '../data-filter/betterSelect'
import { CalendarDatePicker } from '../calendarDatePicker'
import { getDefaultDate } from '@/lib/utils/searchParams'
import { useSearchParams } from 'next/navigation'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onCreate?: () => void
}

export function DataTableToolbar<TData>({
  table,
  onCreate,
}: DataTableToolbarProps<TData>) {
  const searchParams = useSearchParams()
  const isFiltered = table.getState().columnFilters.length > 0
  const [filterColName, setFilterColName] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: getDefaultDate(searchParams).from,

    to: getDefaultDate(searchParams).to,
  })
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          className='w-[150px] rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none lg:w-[250px]'
          placeholder={`Search by ${filterColName}...`}
          value={(table?.getColumn(filterColName)?.getFilterValue() as string) || ''}
          onChange={(event) => {
            console.log(event.target.value, filterColName)
            table?.getColumn(filterColName)?.setFilterValue(event.target.value.toString())
          }}
        />
        <BetterSelect
          title={filterColName ? `Search by ${filterColName}` : 'select to search'}
          items={table
            .getAllColumns()
            .filter((itm: any) => {
              return itm?.columnDef?.enableSearching
            })
            .map((itm: any) => {
              return { id: itm.id, name: itm.columnDef.title }
            })}
          multiple={false}
          selectedItems={[filterColName]}
          setSelectedItems={(selectedItems) => {
            table?.getColumn(filterColName)?.setFilterValue('')
            setFilterColName(selectedItems[0])
          }}
        />

        {table.getAllColumns().map((itm: any) => {
          if (!itm?.columnDef?.enableFiltering) return null
          if (table?.getColumn(itm.id)) {
            return (
              <DataTableFacetedFilter
                column={table.getColumn(itm.id)}
                title={itm.columnDef.title}
                options={itm.columnDef.filtering?.options}
              />
            )
          }
        })}

        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
      {onCreate && (
        <Button className='ml-2 h-8 px-2 lg:px-3' onClick={onCreate}>
          Create
        </Button>
      )}
    </div>
  )
}
