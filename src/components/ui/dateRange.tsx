'use client'

import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Popover, PopoverContent } from '../shadcn/popover'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { Button } from '../shadcn/button'
import { Calendar } from '../shadcn/calendar'

function diplayedRange(from?: Date, to?: Date) {
  function formatDateTime(date: Date) {
    return [
      date.getUTCFullYear(),
      '/',
      (date.getUTCMonth() + 1).toString().padStart(2, '0'),
      '/',
      date.getUTCDate().toString().padStart(2, '0'),
      // ' ',
      // date.getUTCHours().toString().padStart(2, '0'),
      // ':',
      // date.getUTCMinutes().toString().padStart(2, '0'),
    ].join('')
  }

  return !from && !to
    ? 'Today'
    : `${from ? formatDateTime(from) : ''} - ${to ? formatDateTime(to) : ''}`
}

export function DateRange(props: {
  from?: Date
  to?: Date
  onRangeChange: (range?: { from?: Date; to?: Date }) => void
  className?: string
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'default'}
          className={cn('relative w-[14rem] !pl-8', props.className)}
        >
          <CalendarIcon size={16} className='absolute left-2' />
          {diplayedRange(props.from, props.to)}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-auto select-none p-0 pb-3' align='start'>
        <Calendar
          className='z-100'
          mode='range'
          numberOfMonths={2}
          defaultMonth={props.to}
          selected={{ from: props.from, to: props.to }}
          onSelect={props.onRangeChange}
        />
      </PopoverContent>
    </Popover>
  )
}
