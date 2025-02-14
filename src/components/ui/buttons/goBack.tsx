'use client'
import { useRouter } from 'next/navigation'
import { Button } from '../../shadcn/button'
const GoBack = () => {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <Button onClick={handleGoBack} className='w-fit'>
      {'<< Back'}
    </Button>
  )
}

export default GoBack
