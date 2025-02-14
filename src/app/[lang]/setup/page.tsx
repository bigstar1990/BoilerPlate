'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card } from '@/components/shadcn/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/shadcn/form'
import BaseCard from '@/components/ui/cards/baseCard'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { Label } from '@/components/shadcn/label'
import { BetterButton } from '@/components/shadcn/betterButton'
import React from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/actions/user'

// Schéma de validation avec zod
const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export default function Setup({ searchParams }: { searchParams: any }) {
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: any) => {
    setLoading(true)
    registerUser({
      username: data.username,
      password: data.password,
    }).then((res) => {
      console.log(res)
      if (res.success) {
        router.push('/auth/signin')
      }
    })
  }

  return (
    <div className='m-5 mt-8 flex h-full flex-col items-center justify-center'>
      <BaseCard title='Setup' className='w-[400px]'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col items-center justify-center space-y-4'
          >
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <BetterButton loading={loading} type='submit'>
              Submit
            </BetterButton>
          </form>
        </Form>
      </BaseCard>
    </div>
  )
}
