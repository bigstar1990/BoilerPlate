'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Separator } from '@/components/shadcn/separator'
import { cn } from '@/lib/utils'

type BaseCardProps = {
  title: any
  children: any
  className?: string
  contentClassName?: string
  headerClassName?: string
}

export default function BaseCard(props: BaseCardProps) {
  return (
    <Card className={cn('p-4 shadow-md', props.className)}>
      <CardHeader className={cn('flex flex-row p-2', props.headerClassName)}>
        <CardTitle className={cn('text-nowrap pr-1')}>{props.title}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className={cn('h-[calc(100%-3rem)] p-0', props.contentClassName)}>
        {props.children}
      </CardContent>
    </Card>
  )
}
