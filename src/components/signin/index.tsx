'use client'
import React, { useState, useCallback } from 'react'
import { signIn, signOut, useSession, getCsrfToken } from 'next-auth/react'
import { unstable_cache } from 'next/cache'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/card'

import { Button } from '@/components/shadcn/button'

//connection page using shadcn card with username password (possibility to hide password) and connection with next-auth

const getCachedCsrfToken = unstable_cache(
  async () => {
    return await getCsrfToken()
  },
  ['csrf-token'],
  { revalidate: 3600 } // Cache for 1 hour
)

export default function SignIn() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const session = useSession()

  const handleSignIn = useCallback(async () => {
    try {
      const csrfToken = await getCachedCsrfToken()
      const response = await signIn('credentials', {
        username,
        password,
        csrfToken,
        callbackUrl: '/',
        redirect: false,
      })

      if (response?.error) {
        setError(response.error)
      } else if (response?.url) {
        window.location.href = response.url
      }
    } catch (err) {
      setError('An error occurred during sign in')
    }
  }, [username, password])

  return (
    <Card className='mx-auto mt-8 w-[350px]'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-center text-2xl'>Sign in</CardTitle>
        <CardDescription className='text-center'>
          Enter your credentials to continue
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <div className='grid gap-4'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            id='showPassword'
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className='rounded border-gray-300 focus:ring-primary'
          />
          <label htmlFor='showPassword' className='text-sm text-muted-foreground'>
            Show password
          </label>
        </div>
        <Button onClick={handleSignIn} type='submit' className='w-full'>
          Sign in
        </Button>
      </CardContent>
      {error && (
        <CardFooter>
          <p className='text-sm text-red-500'>{error}</p>
        </CardFooter>
      )}
    </Card>
  )
}
