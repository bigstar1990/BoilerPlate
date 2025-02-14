'use client'

import React, { useState } from 'react'

import { Button } from '@/components/shadcn/button'

import { useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

import { getDefaultDate, setParams } from '@/lib/utils/searchParams'
import { CalendarDatePicker } from '../calendarDatePicker'

const DataFilter = () => {
  const searchParams = useSearchParams()

  const [selectedDateRange, setSelectedDateRange] = useState({
    from: getDefaultDate(searchParams).from,
    to: getDefaultDate(searchParams).to,
  })

  return (
    <div className={cn('mb-6 flex w-full items-center justify-end space-x-5')}>
      <CalendarDatePicker date={selectedDateRange} onDateSelect={setSelectedDateRange} />

      <Button
        variant='default'
        onClick={() => {
          setParams([
            { key: 'from', value: selectedDateRange.from.toISOString() },
            { key: 'to', value: selectedDateRange.to.toISOString() },
          ])
        }}
      >
        Submit
      </Button>
    </div>
  )
}

export default DataFilter
