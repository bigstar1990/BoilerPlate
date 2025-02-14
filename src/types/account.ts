type Account = {
  id: string
  name: string
  owner: string
  createdBy: string
  status: 'active' | 'inactive' | 'deleted' | 'pending'
}

export default Account
