'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shadcn/accordion'
import { Separator } from '@/components/shadcn/separator'
import { cn } from '@/lib/utils'

type DrawerProps = {
  open: boolean
  cancel: () => void
  title: string
  children: Array<{ name: string; children: any }>
  type: 'single' | 'multiple'
}

export default function AccordionCustom(props: DrawerProps) {
  return (
    <div className='flex flex-col'>
      {props.children.map((item, index) => (
        <Accordion key={index} type={props.type}>
          <AccordionItem value={item.name}>
            <AccordionTrigger>{item.name}</AccordionTrigger>
            <AccordionContent>{item.children}</AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  )
}
// Compare this snippet from Subleep2.0/src/components/ui/accordion.tsx:
