import Bcrypt from 'bcrypt'

const SALT_ROUNDS = process.env.SALT_ROUNDS || '10'

export async function hash(password: string) {
  // console.log(await Bcrypt.hash(password, parseInt(SALT_ROUNDS)));
  return await Bcrypt.hash(password, parseInt(SALT_ROUNDS))
}
// hash("123123")
export async function compare(password: string, hash: string) {
  return await Bcrypt.compare(password, hash)
}
