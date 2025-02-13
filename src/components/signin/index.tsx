'use client'
import React from 'react'
import { useState } from 'react'
import { signIn, signOut, useSession, getCsrfToken } from 'next-auth/react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/card'

import { Button } from '@/components/shadcn/button'
import { cn } from '@/lib/utils'

//connection page using shadcn card with username password (possibility to hide password) and connection with next-auth

export default function SignIn() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const session = useSession()

  const handleSignIn = async () => {
    const csrfToken = await getCsrfToken()
    const response = await signIn('Credentials', {
      username,
      password,
      csrfToken,
      callbackUrl: '/',
      redirect: true,
    })
    // console.log(response,username,password);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('flex flex-col space-y-4')}>
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>
            <input
              type='checkbox'
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show password
          </label>
        </div>
        <Button
          onClick={() => {
            handleSignIn()
          }}
          type='submit'
        >
          Sign in
        </Button>
      </CardContent>
    </Card>
  )
}
