'use client'

import * as React from 'react'
import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/shadcn/button'
import { Calendar } from '@/components/shadcn/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'

interface DatePickerProps {
  value: string // ISO string
  onChange: (value: string) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | null>(
    value ? new Date(parseISO(value)) : null
  )

  React.useEffect(() => {
    if (date) {
      // Normalize the date to UTC and format it as an ISO string
      const normalizedDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      )
      console.log(normalizedDate.toISOString().split('T')[0])

      onChange(normalizedDate.toISOString().split('T')[0]) // Format YYYY-MM-DD
    }
  }, [date, onChange])

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date || undefined}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate)
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
