'use client'
import React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { cn } from '@/lib/utils'
import { Button } from '../shadcn/button'
import { action } from './action'
import { useToast } from '@/hooks/use-toast'
// import { ModifyToast } from '../ui/ModifyToast'

export default function SignUp () {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {toast} = useToast();
  const addUser = async () => {
    // if (password != confirmPassword) {

    // }
    const { ok, error } = await action(username, password)
    if(ok) {
      // ModifyToast("Register Successfully", "#4CAF50");
      toast({
        description: 'Register Successfully',
        duration: 2000,
        style: {
          position: 'fixed',
          top: '10%', 
          right: '2%',
          width: '20%',
          justifyContent:'center',
          // transform: 'translateX(-50%)', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '5px', 
          zIndex: 1000, 
        },
      });
    }
    if(error) {
      toast({
        description: `${error}`,
        duration: 2000,
        style: {
          position: 'fixed',
          top: '10%', 
          right: '2%',
          width: '20%',
          justifyContent:'center',
          // transform: 'translateX(-50%)', 
          backgroundColor: '#f87171', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '5px', 
          zIndex: 1000, 
        },
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('flex flex-col space-y-4')}>
          <input
            className='border-2 rounded-md p-1 border-gray-300'
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className='border-2 rounded-md p-1 border-gray-300'
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className='border-2 rounded-md p-1 border-gray-300'
            type={showPassword ? 'text' : 'password'}
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label className='flex flex-row'>
            <input
              type='checkbox'
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <div className='pl-2'>Show password</div>
          </label>
        </div>
        <Button className='mt-4'
          onClick={addUser}
        >
          Sign up
        </Button>
        <div className='flex justify-end pt-2 text-sm'>
          <div className='bg-red'>
            Already registered, <a className='italic text-red-800' href='/en/auth/signin'>SignIn</a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}