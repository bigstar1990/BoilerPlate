import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { getUser } from '@/lib/db/users'
import Role from '@/types/role'

export async function verifUser(
  requireRole = ''
): Promise<{ success: boolean; user?: any; profil?: any; res?: any }> {
  const session = await getServerSession(authOptions)

  console.log(session)

  if (!session?.user?.username)
    return { success: false, res: { status: 400, success: false, error: 'no username' } }

  const { user, error: errorUser } = await getUser(session.user.username)

  if (errorUser || !user)
    return { success: false, res: { status: 500, success: false, error: errorUser } }

  const userRole = user.role as Role

  if (requireRole === '') {
    // If no specific role required, check if the user's role is user, admin, or super-admin
    if (userRole === 'user' || userRole === 'admin' || userRole === 'super-admin') {
      return { success: true, user }
    } else {
      return {
        success: false,
        res: { status: 403, success: false, error: 'insufficient privileges' },
      }
    }
  } else {
    // If specific role required, check if the user's role is equal to or greater than the required role
    const roleIndex = ['user', 'admin', 'super-admin'].indexOf(userRole)
    const requireRoleIndex = ['user', 'admin', 'super-admin'].indexOf(requireRole)
    if (requireRoleIndex && roleIndex >= requireRoleIndex) {
      return { success: true, user }
    } else {
      return {
        success: false,
        res: { status: 403, success: false, error: 'insufficient privileges' },
      }
    }
  }
}
