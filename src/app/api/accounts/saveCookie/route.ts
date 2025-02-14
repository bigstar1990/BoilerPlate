import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const account_id = body?.account_id

    if (!account_id) {
      return NextResponse.json({ success: false, error: 'Invalid account_id' })
    }

    console.log('account_id from api', account_id)
    ;(await cookies()).set({
      value: account_id,
      name: 'account_id',
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log('ERROR FROM POST', error)
    return NextResponse.json({ success: false, error: error })
  }
}
