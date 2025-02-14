import { Suspense, type ReactNode } from 'react'
import type { Metadata } from 'next'

import '@/app/globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { locales, DictionaryProvider } from '@/localization'
import { getDictionary } from '@/localization/dictionaries'
import { UIProviders } from '@/components/providers/ui.provider'

import SessionProvider from '@/components/providers/sessionProvider'
import { authOptions } from '@/lib/auth'

import { getAccounts } from '@/lib/db/account'
import { AccountProvider } from '@/components/providers/AccountProvider'

import Loading from '@/components/ui/loading'
import { SidebarProvider, SidebarTrigger } from '@/components/shadcn/sidebar'
import { AppSidebar } from '@/components/providers/sidebar/app-sidebar'
import { getServerSession } from 'next-auth'

const inter = Inter({ subsets: ['latin'] })

const getAccountInfos = async (username: string): Promise<{ accounts: any }> => {
  if (!username) return { accounts: [] }
  let { accounts } = await getAccounts({ owner: username as string })
  return { accounts }
}
export async function generateStaticParams() {
  return Object.keys(locales).map((lang) => ({ lang }))
}

type RootLayoutProps = {
  children: ReactNode
  params: any
}

export async function generateMetadata(props: RootLayoutProps) {
  const dictionary = await getDictionary((await props.params)?.lang)

  return {
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: dictionary.metaDescription,
  } as Metadata
}

export default async function RootLayout(props: RootLayoutProps) {
  const dictionary = await getDictionary((await props.params)?.lang)
  const session = await getServerSession(authOptions)
  const { accounts } = await getAccountInfos(session?.user?.username as string)

  return (
    <html lang={(await props.params)?.lang} suppressHydrationWarning>
      <body>
        <DictionaryProvider dictionary={dictionary}>
          <Suspense fallback={<Loading />}>
            <AccountProvider session={session} accounts={accounts || []}>
              <UIProviders>
                <SessionProvider session={session}>
                  <SidebarProvider>
                    <div className={cn('flex w-full flex-col')}>
                      <Suspense fallback={<Loading />}>{props.children}</Suspense>
                    </div>
                    <div className='m-6 flex justify-between'>
                      <SidebarTrigger />
                    </div>
                    <AppSidebar
                      session={session}
                      accounts={accounts}
                      toggleFlip={undefined}
                    />
                  </SidebarProvider>
                </SessionProvider>
              </UIProviders>
            </AccountProvider>
          </Suspense>
        </DictionaryProvider>
      </body>
    </html>
  )
}
