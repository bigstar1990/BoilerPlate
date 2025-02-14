'use client'

import { zodResolver } from '@hookform/resolvers/zod'

import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Button } from './button'
import { Calendar } from './calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { ScrollArea } from './scroll-area'
import { CalendarIcon } from 'lucide-react'
import { BetterButton } from './betterButton'

const FormSchema = z.object({
  datetime: z.date({
    required_error: 'Date & time is required!.',
  }),
})

export function DateTimePicker({
  loading,
  onSubmit,
}: {
  loading?: boolean
  onSubmit: (data: z.infer<typeof FormSchema>) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [time, setTime] = useState<string>('05:00')
  const [date, setDate] = useState<Date | null>(null)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='flex w-full items-center justify-start gap-4'>
          <FormLabel>Start the </FormLabel>

          <FormField
            control={form.control}
            name='datetime'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-fit font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          `${format(field.value, 'PPP')}, ${time}`
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-fit p-0' align='start'>
                    <Calendar
                      mode='single'
                      captionLayout='dropdown'
                      selected={date || field.value}
                      onSelect={(selectedDate) => {
                        const [hours, minutes] = time?.split(':')!
                        selectedDate?.setHours(parseInt(hours), parseInt(minutes))
                        setDate(selectedDate!)
                        field.onChange(selectedDate)
                      }}
                      onDayClick={() => setIsOpen(false)}
                      // disabled={(date) =>
                      //   Number(date) < Date.now() - 1000 * 60 * 60 * 24 ||
                      //   Number(date) > Date.now() + 1000 * 60 * 60 * 24 * 30
                      // }
                      defaultMonth={field.value}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormLabel>At</FormLabel>
          <FormField
            control={form.control}
            name='datetime'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormControl>
                  <Select
                    defaultValue={time!}
                    onValueChange={(e) => {
                      setTime(e)
                      if (date) {
                        const [hours, minutes] = e.split(':')
                        const newDate = new Date(date.getTime())
                        newDate.setHours(parseInt(hours), parseInt(minutes))
                        setDate(newDate)
                        field.onChange(newDate)
                      }
                    }}
                  >
                    <SelectTrigger className='w-[120px] font-normal focus:ring-0'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className='h-[15rem]'>
                        {Array.from({ length: 96 }).map((_, i) => {
                          const hour = Math.floor(i / 4)
                            .toString()
                            .padStart(2, '0')
                          const minute = ((i % 4) * 15).toString().padStart(2, '0')
                          return (
                            <SelectItem key={i} value={`${hour}:${minute}`}>
                              {hour}:{minute}
                            </SelectItem>
                          )
                        })}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <BetterButton
            loading={loading}
            type='submit'
            className={cn('w-full bg-blue-500')}
          >
            Start
          </BetterButton>
        </div>
      </form>
    </Form>
  )
}
