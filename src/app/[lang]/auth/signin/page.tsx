import SignInElement from '@/components/signin'
import { cn } from '@/lib/utils'

export default async function SignIn() {
  return (
    <main className={cn('flex h-screen w-full flex-col items-center justify-center')}>
      <SignInElement />
    </main>
  )
}
