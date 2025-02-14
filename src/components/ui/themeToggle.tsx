'use client'

import { Button } from '@/components/shadcn/button'
import { cn } from '@/lib/utils'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(className)}
    >
      <Sun className='rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
