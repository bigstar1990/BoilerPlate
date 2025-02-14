'use client'
import { useRouter } from 'next/navigation'
import { Button } from '../../shadcn/button'
const GoTo = ({
  url,
  text,
  className,
}: {
  url: string
  text: string
  className?: string
}) => {
  const router = useRouter()

  const handleGoTO = () => {
    // url will be /admin/user
    router.push(url)
  }

  return (
    <Button className={className} onClick={handleGoTO}>
      <span>{text}</span>
    </Button>
  )
}

export default GoTo
