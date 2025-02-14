'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/shadcn/sidebar'
import { usePathname } from 'next/navigation'
import { useDictionary } from '@/localization'
import { getLocale, getPathnameWithoutLocale } from '@/lib/localPath'

import { LineChart, CalendarCheck, Users, UserCog, ShieldMinus } from 'lucide-react'
import React from 'react'
import { CardTitle } from '../../shadcn/card'
import { Label } from '../../shadcn/label'
import SidebarFooterMenu from './sidebar-footer'
import { ThemeToggle } from '@/components/ui/themeToggle'
import NotificationBadge from '@/components/shadcn/notification-bade'
import Account from '@/types/account'

const gradientStyle =
  'bg-gradient-to-r from-pink-600 to-purple-800 text-primary-foreground dark:text-primary'

export function AppSidebar({
  session,
  accounts,
  toggleFlip,
}: {
  session: any
  accounts?: Account[]
  toggleFlip: any
}) {
  const pathname = usePathname()
  const locale = getLocale(pathname)
  const pathNameWithoutLocale = getPathnameWithoutLocale(pathname)

  if (pathNameWithoutLocale.startsWith('/auth')) return null

  if (!session) return null

  const items = [
    {
      title: 'Home',
      url: `/${locale}/`,
      icon: LineChart,
      hide: false,
    },

    {
      title: 'Admin',
      url: `/${locale}/admin`,
      icon: ShieldMinus,
      hide: !(session?.user?.role === 'admin' || session?.user?.role === 'super-admin'),
    },
  ]

  return (
    <Sidebar className='flex h-screen flex-col' side='right'>
      <SidebarContent className='flex flex-col'>
        {/* Header Section */}
        <SidebarGroup>
          <div className='flex flex-col items-center justify-center border-b-2 p-4'>
            <CardTitle className='text-center'>Subleep</CardTitle>
            <Label className='mb-4 text-center text-sm'>v2.0</Label>
          </div>
        </SidebarGroup>

        {/* Menu Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => !item.hide)
                .map((item) => (
                  <SidebarMenuItem key={item.title} className='mt-3'>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`flex h-fit items-center gap-4 rounded-lg p-3 text-lg hover:bg-muted ${
                          pathNameWithoutLocale === item.url.replace(`/${locale}`, '')
                            ? 'bg-card font-extrabold shadow'
                            : ''
                        }`}
                      >
                        <item.icon
                          className={`min-h-8 min-w-8 rounded p-1 ${
                            pathNameWithoutLocale === item.url.replace(`/${locale}`, '')
                              ? gradientStyle
                              : 'bg-card shadow'
                          }`}
                        />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className='flex items-center justify-center space-x-1 p-4'>
        <NotificationBadge />
        <SidebarFooterMenu user={session?.user} accounts={accounts} />
        <ThemeToggle className='min-w-fit' />
      </div>
    </Sidebar>
  )
}
