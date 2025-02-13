import clientPromise from '@/lib/mongoClient'
import User from '@/types/user'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'

const dbName = process.env.MONGO_DATABASE_NAME
const Users = process.env.MONGO_COLLECTION_USERS as string

let client: MongoClient | null = null
let db: Db | null = null
let U: Collection

async function init() {
  if (db) return
  try {
    client = await clientPromise
    db = client.db(dbName)
    U = db.collection(Users)
  } catch (error) {
    console.log(error)

    throw new Error('Failed to connect to database')
  }
}

export async function getChilds(username: string): Promise<{
  users: User[]
  error?: any
}> {
  try {
    if (!db) await init()
    const users = await U.find({ parent: username }).toArray()
    return {
      users: users.map((user) => ({
        username: user.username,
        password: user.password,
        role: user.role,
        parent: user.parent ?? '',
      })),
    }
  } catch (error) {
    return {
      users: [],
      error,
    }
  }
}

export async function createUser({
  username,
  password,
  role,
  parent = '',
}: User): Promise<{
  ok: boolean
  error?: any
}> {
  try {
    if (!db) await init()
    const { user, error } = await getUser(username)
    if (user) return { ok: false, error: 'user already exist' }
    const result = await U.insertOne({
      username,
      password,
      role,
      parent,
    })
    return { ok: result.acknowledged }
  } catch (error) {
    return {
      ok: false,
      error,
    }
  }
}

export async function updateUser({
  username,
  newUsername,
  newPassword,
  newRole,
  newParent = '',
}: {
  username: string
  newUsername: string
  newPassword: string
  newRole?: string
  newParent?: string
}): Promise<{
  ok: boolean
  error?: any
}> {
  try {
    if (!db) await init()
    const { user: fetchedUser, error } = await getUser(username)

    if (!fetchedUser) return { ok: false, error: 'user does not exist' }

    if (username !== newUsername) {
      const { user: userExist } = await getUser(newUsername)
      if (userExist) return { ok: false, error: 'user already exist' }
    }

    const { user: parentUser } = await getUser(newParent)

    if (newParent && !parentUser) return { ok: false, error: 'parent does not exist' }

    let query = { username: newUsername, password: newPassword } as any

    if (newRole) query.role = newRole

    if (newParent) query.parent = newParent

    const result = await U.updateOne(
      { username },
      {
        $set: query,
      }
    )
    return { ok: result.acknowledged }
  } catch (error) {
    return {
      ok: false,
      error,
    }
  }
}

export async function getUserById(id: string): Promise<{
  user: User | null
  error?: any
}> {
  try {
    if (!db) await init()
    const users = await U.find({ _id: new ObjectId(id) }).toArray()
    if (users.length === 0) return { user: null }
    if (users.length > 1) throw new Error('multiple users found')
    return {
      user: {
        username: users[0].username,
        password: users[0].password,
        role: users[0].role,
        parent: users[0].parent ?? '',
      },
    }
  } catch (error) {
    return {
      user: null,
      error,
    }
  }
}

export async function getUser(username: string): Promise<{
  user: User | null
  error?: any
}> {
  try {
    if (!db) await init()
    const users = await U.find({ username }).toArray()
    if (users.length === 0) return { user: null }
    if (users.length > 1) throw new Error('multiple users found')
    return {
      user: {
        username: users[0].username,
        password: users[0].password,
        role: users[0].role,
        parent: users[0].parent ?? '',
      },
    }
  } catch (error) {
    return {
      user: null,
      error,
    }
  }
}

export async function getUserByLicense(license: string): Promise<{
  user: User | null
  error?: any
}> {
  try {
    if (!db) await init()
    const users = await U.find({ license }).toArray()
    if (users.length === 0) return { user: null }
    if (users.length > 1) throw new Error('multiple users found')
    return {
      user: {
        username: users[0].username,
        password: users[0].password,
        role: users[0].role,
        parent: users[0].parent ?? '',
      },
    }
  } catch (error) {
    return {
      user: null,
      error,
    }
  }
}

export async function setPassword({
  username,
  password,
}: {
  username: string
  password: string
}): Promise<{
  ok: boolean
  error?: any
}> {
  try {
    if (!db) await init()
    const { user, error } = await getUser(username)
    if (!user) throw new Error('user does not exist')
    if (error) throw error
    const result = await U.updateOne({ username }, { $set: { password } })
    return { ok: result.acknowledged }
  } catch (error) {
    return {
      ok: false,
      error,
    }
  }
}

export async function getUsersLenght(): Promise<{
  length: number
  error?: any
}> {
  try {
    if (!db) await init()
    const users = await U.countDocuments()
    return {
      length: users,
    }
  } catch (error) {
    return {
      length: 0,
      error,
    }
  }
}

export async function getUsers(): Promise<{
  users: User[]
  error?: any
}> {
  try {
    if (!db) await init()
    const users = await U.find().toArray()
    return {
      users: users.map((user) => ({
        id: user._id.toString(),
        username: user.username,
        password: user.password,
        role: user.role,
        parent: user.parent ?? '',
      })),
    }
  } catch (error) {
    return {
      users: [],
      error,
    }
  }
}

export async function deleteUser(username: string): Promise<{
  ok: boolean
  error?: any
}> {
  try {
    if (!db) await init()
    const { user, error } = await getUser(username)
    if (!user) throw new Error('user does not exist')
    if (error) throw error
    const result = await U.deleteOne({ username })
    return { ok: result.acknowledged }
  } catch (error) {
    return {
      ok: false,
      error,
    }
  }
}
