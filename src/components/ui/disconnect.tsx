'use client'

import { Button } from '@/components/shadcn/button'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
//disconnect button using shadcn button

export function Disconnect() {
  return (
    <Button
      variant={'destructive'}
      onClick={async () => await signOut()}
      className={cn('text-lg shadow')}
    >
      <LogOut className={cn('mr-1')} />
      Disconnect
    </Button>
  )
}
