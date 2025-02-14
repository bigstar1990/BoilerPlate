'use server'
import { verifUser } from '@/lib/utils/verifyUser'
import {
  getUsers as getUsersDB,
  createUser as createUserDB,
  updateUser,
  getUser,
  getUserById,
  deleteUser as deleteUserDB,
} from '@/lib/db/users'
import setup from '../../setup.json'
import { hash } from '@/lib/utils/hash'
import { write } from 'console'
import { writeFile } from 'fs/promises'
import { revalidatePath } from 'next/cache'
import User from '@/types/user'
import Role from '@/types/role'
export async function getUsers(): Promise<{ success: boolean; users: User[] }> {
  try {
    const { success, user, res } = await verifUser('admin')

    if (!success || !user) return res

    const { users } = await getUsersDB()

    if (!users) return { success: false, users: [] }

    return { success: true, users }
  } catch (error) {
    console.log(error)
    return { success: false, users: [] }
  }
}

export async function createUserAdmin({
  id,
  username,
  password,
  role,
  parent,
}: {
  id?: string
  username: string
  password: string
  role: Role
  parent?: string
}): Promise<{ success: boolean; message: string }> {
  try {
    const { success, user, res } = await verifUser('admin')

    if (!success || !user) return res
    console.log('createUserAdmin', username, password, role, parent, id)
    if (!id) {
      const { ok, error } = await createUserDB({
        username,
        password: await hash(password),
        role,
        parent,
      })

      if (!ok) return { success: false, message: error }

      revalidatePath('/admin/users')

      return { success: true, message: 'Account created' }
    } else {
      const { user } = await getUserById(id)

      if (!user) return { success: false, message: 'User not found' }

      const { ok, error } = await updateUser({
        username: user.username,
        newUsername: username,
        newPassword: await hash(password),
        newRole: role,
        newParent: parent,
      })

      if (!ok) return { success: false, message: error }

      revalidatePath('/admin/users')

      return { success: true, message: 'Account updated' }
    }
  } catch (error) {
    console.log(error)
    return { success: false, message: 'Error creating account' }
  }
}

export async function registerUser({
  username,
  password,
}: {
  username: string
  password: string
}): Promise<{ success: boolean; message: string }> {
  try {
    if (!setup.setup) return { success: false, message: 'Setup not required' }
    const { ok, error } = await createUserDB({
      username,
      password: await hash(password),
      role: 'super-admin',
    })
    console.log(ok, error)

    if (!ok) return { success: false, message: 'Error creating user' }
    await setSetupFalse()
    return { success: true, message: 'User created' }
  } catch (error) {
    console.log(error)
    return { success: false, message: 'Error creating user' }
  }
}

async function setSetupFalse() {
  //modify setup.json

  setup.setup = false

  await writeFile('setup.json', JSON.stringify(setup))
}

export async function createUser({
  username,
  password,
  role,
  parent,
}: {
  username: string
  password: string
  role: string
  parent?: string
}): Promise<{ success: boolean; message: string }> {
  try {
    const { success, user, res } = await verifUser('admin')

    if (!success || !user) return res

    // TODO : add user to database
    return { success: true, message: 'User created' }
  } catch (error) {
    console.log(error)
    return { success: false, message: 'Error creating user' }
  }
}

export async function deleteUserAdmin({
  id,
}: {
  id: string
}): Promise<{ success: boolean; message: string }> {
  try {
    const { success, user, res } = await verifUser('admin')

    if (!success || !user) return res

    const { user: userBD } = await getUserById(id)

    if (!userBD) return { success: false, message: 'User not found' }

    // TODO : delete user from database

    return { success: true, message: 'User deleted' }
  } catch (error) {
    console.log(error)
    return { success: false, message: 'Error deleting user' }
  }
}
