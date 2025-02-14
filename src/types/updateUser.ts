import Role from './role'
import Status from './status'
type UpdateUser = {
  id: Number
  role?: Role
  status?:Status
}

export default UpdateUser
