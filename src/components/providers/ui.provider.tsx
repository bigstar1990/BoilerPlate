'use client'

import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/shadcn/tooltip'

const themeProps = {
  themes: ['light', 'dark'],
  defaultTheme: 'system',
  enableSystem: true,
}

const tooltipProps = {
  delayDuration: 200,
  skipDelayDuration: 100,
}

export function UIProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' {...themeProps}>
      <TooltipProvider {...tooltipProps}>{children}</TooltipProvider>
    </ThemeProvider>
  )
}
