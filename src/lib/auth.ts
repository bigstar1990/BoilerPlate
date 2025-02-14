import type { NextAuthOptions, User } from 'next-auth'
import credentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter as mongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongoClient'
import { randomUUID, randomBytes } from 'crypto'
import { getUser } from './db/users'
import { compare } from './utils/hash'

const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME
const MONGO_COLLECTION_ACCOUNTS = process.env.MONGO_COLLECTION_ACCOUNTS
const MONGO_COLLECTION_SESSIONS = process.env.MONGO_COLLECTION_SESSIONS
const MONGO_COLLECTION_USERS = process.env.MONGO_COLLECTION_USERS
const MONGO_COLLECTION_VERIFICATION_TOKENS =
  process.env.MONGO_COLLECTION_VERIFICATION_TOKENS

if (!MONGO_DATABASE_NAME) throw new Error('MONGO_DATABASE_NAME not defined')
if (!MONGO_COLLECTION_ACCOUNTS) throw new Error('MONGO_COLLECTION_ACCOUNTS not defined')
if (!MONGO_COLLECTION_SESSIONS) throw new Error('MONGO_COLLECTION_SESSIONS not defined')
if (!MONGO_COLLECTION_USERS) throw new Error('MONGO_COLLECTION_USERS not defined')
if (!MONGO_COLLECTION_VERIFICATION_TOKENS)
  throw new Error('MONGO_COLLECTION_VERIFICATION_TOKENS not defined')

export const authOptions: NextAuthOptions = {
  providers: [
    credentialsProvider({
      id: 'Credentials',
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        try {
          console.log(credentials, 'credentials')

          if (!credentials) return null
          const { user } = await getUser(credentials.username)

          if (!user) return null
          const isAuthorized = await compare(credentials.password, user.password)
          console.log(isAuthorized, 'authorized')

          if (isAuthorized) {
            return {
              id: user.id || '',
              username: user.username,
              role: user.role,
            }
          }
          return null
        } catch (error) {
          console.log(error)
          return null
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString('hex')
    },
  },
  adapter: mongoDBAdapter(clientPromise, {
    collections: {
      Accounts: MONGO_COLLECTION_ACCOUNTS,
      Sessions: MONGO_COLLECTION_SESSIONS,
      Users: MONGO_COLLECTION_USERS,
      VerificationTokens: MONGO_COLLECTION_VERIFICATION_TOKENS,
    },
    databaseName: MONGO_DATABASE_NAME,
  }) as any,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl
    },

    async session({ session, token, user }) {
      session.user = token.user as User

      return session
    },

    async jwt({ token, user, account }) {
      if (user) token.user = user as User

      const u = token.user as any
      let { user: dbUser, error } = await getUser(u.username)

      if (!dbUser) {
        return token
      }

      u.role = dbUser ? dbUser.role : 'guest'
      return token
    },
  },
  logger: {
    error(code, ...message) {
      console.error(code, message)
    },
    warn(code, ...message) {
      console.warn(code, message)
    },
    debug(code, ...message) {
      console.debug(code, message)
    },
  },
}
