import Role from './role'
type User = {
  id?: string
  username: string
  password: string
  status?: 'Inactive' | 'Active'
  role: Role
  createdAt?: Date
  parent?: string
}

export default User
