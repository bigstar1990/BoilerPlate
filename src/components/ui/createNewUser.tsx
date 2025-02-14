import React, { useState } from "react"

import { Button } from '@/components/shadcn/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/card'
import { Input } from "../shadcn/input"
import { Label } from "../shadcn/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select"
import Role from "@/types/role"
import Status from "@/types/status"
interface CreateNewUserProps {
    state: boolean;
    setState: (value: boolean) => void;
  }
  
  export function CreateNewUser({ state, setState }: CreateNewUserProps) {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [role, setRole] = useState<Role>('user');
  const [status, setStatus] = useState<Status>('Inactive');
  async function createUser() {
    console.log('hello');
    
  }
  return (
    <div className="absolute flex justify-center items-center h-full w-full bg-gray-200">
    <Card className="w-1/2 min-w-[350px]">
        <CardHeader>
            <CardTitle>Create New User</CardTitle>
            <CardDescription>Double check before create</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={()=>createUser()}>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Input username" required onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="Input email" type="email" required onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" placeholder="Input password" type={!showPassword?"password":"text"} required onChange={(e) => setPassword(e.target.value)}/>                    
                    </div>
                    <label className='flex flex-row'>
                        <input
                        type='checkbox'
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        />
                        <div className='pl-2'>Show password</div>
                    </label>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="framework">Role</Label>
                        <Select onValueChange={(e:Role) => setRole(e)}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="user" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="admin">admin</SelectItem>
                                <SelectItem value="user">user</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="framework">Plan Status</Label>
                        <Select onValueChange={(e:Status) => setStatus(e)}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Inactive" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <CardFooter className="flex justify-between gap-4 pt-8">
                    <Button variant="outline" onClick={()=>setState(false)}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </CardFooter>
            </form>
        </CardContent>
    </Card>
    </div>
  )
}
