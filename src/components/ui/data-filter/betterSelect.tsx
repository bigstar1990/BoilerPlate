'use client'

import React, { useState, useEffect } from 'react'
import { Label } from '@/components/shadcn/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Button } from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { X } from 'lucide-react'
import { Separator } from '@/components/shadcn/separator'
import { Input } from '@/components/shadcn/input'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import item from '@/types/ui/item'

type filter = {
  title: string
  items: Array<{ title: string; className?: string; selected?: boolean }>
  accessor: string
}

type contentFilterProps = {
  title?: any
  items: Array<item>
  filters?: Array<filter>
  multiple?: boolean
  selectedItems: Array<any> | any
  setSelectedItems: (items: Array<any> | any) => void
}

const BetterSelect: React.FC<contentFilterProps> = (props) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState<item[]>(props.items)
  const [filters, setFilters] = useState(
    props.filters?.map((filter) => ({
      ...filter,
      selected: 'all',
    })) || []
  )

  useEffect(() => {
    const updatedFilteredItems = props?.items?.filter(
      (item) =>
        item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        filters.every((filter) => {
          if (filter.selected === 'all') return true
          return (
            filter.selected?.toString()?.toLowerCase() ===
            item[filter.accessor]?.toString()?.toLowerCase()
          )
        })
    )
    setFilteredItems(updatedFilteredItems)
  }, [searchQuery, filters, props.items])

  const handleFilterChange = (index: number, value: string) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter, i) =>
        i === index ? { ...filter, selected: value } : filter
      )
    )
  }

  const toggleSelection = (item: any) => {
    if (props.multiple) {
      const isSelected = Array.isArray(props.selectedItems)
        ? props.selectedItems.some((selectedItem: any) => selectedItem.id === item.id)
        : false
      const newSelectedItems = isSelected
        ? props.selectedItems.filter((selectedItem: any) => selectedItem.id !== item.id)
        : [...(Array.isArray(props.selectedItems) ? props.selectedItems : []), item]
      props.setSelectedItems(newSelectedItems)
    } else {
      const isSelected = props.selectedItems?.id === item.id
      props.setSelectedItems(isSelected ? '' : item)
    }
  }

  const handleSelectAll = () => {
    if (props.multiple) {
      const allItems = filteredItems.map((item) => item)
      props.setSelectedItems(allItems)
    }
  }

  const handleDeselectAll = () => {
    if (props.multiple) {
      props.setSelectedItems([])
    }
  }

  return (
    <DropdownMenu modal={true}>
      <DropdownMenuTrigger asChild className='w-fit'>
        <Button variant='outline'>{props.title}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='h-fit w-fit overflow-y-auto pb-4'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='relative p-2'>
          <Input
            onFocus={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder='Search...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              onClick={() => {
                setSearchQuery('')
              }}
            >
              <X size={16} />
            </Button>
          )}
        </div>

        {props.multiple && (
          <div className='flex justify-between p-2'>
            <Button variant='secondary' size='sm' onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant='secondary' size='sm' onClick={handleDeselectAll}>
              Deselect All
            </Button>
          </div>
        )}

        {filters.map((filter, index) => (
          <DropdownMenuLabel key={index}>
            <Select
              value={filter.selected}
              onValueChange={(value) => handleFilterChange(index, value)}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder={filter.items[0]?.title} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                {filter.items.map((item, i) => (
                  <SelectItem className={item.className} key={i} value={item.title}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DropdownMenuLabel>
        ))}

        <Separator className='my-2' />

        <ScrollArea className='h-48'>
          {filteredItems?.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.id}
              checked={
                Array.isArray(props.selectedItems)
                  ? props.selectedItems.some(
                      (selectedItem: any) => selectedItem.id === item.id
                    )
                  : props.selectedItems?.id === item.id
              }
              onClick={(e) => {
                e.preventDefault()
                toggleSelection(item)
              }}
            >
              <Label>{item?.accessorFn ? item.accessorFn(item) : item.name}</Label>
            </DropdownMenuCheckboxItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BetterSelect
