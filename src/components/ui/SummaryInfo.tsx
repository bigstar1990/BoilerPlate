'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Separator } from '@/components/shadcn/separator'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../shadcn/table'
import { ScrollArea } from '../shadcn/scroll-area'

type InfoCardProps = {
  title: string
  children: any
}

function InfoCard(props: InfoCardProps) {
  return (
    <Card className={cn('h-52 p-5 shadow-md')}>
      <CardHeader className={cn('flex flex-row p-2')}>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className={cn('p-5 text-xl')}>{props.children}</CardContent>
    </Card>
  )
}

const SummaryInfo = ({
  dateRange,
  qwickRange,
  selectedCampaign,
  ordersLenght,
  customerLenght,
  orders,
  litiges,
}: any) => {
  console.log(orders)

  return (
    <div>
      <div
        className={cn(
          'grid grid-cols-3 gap-4',
          'w-auto',
          'p-10',
          'md:grid-cols-1',
          'lg:grid-cols-2',
          'xl:grid-cols-3'
        )}
      >
        <InfoCard title={'Gross Revenue'}>{-1000}</InfoCard>
        <InfoCard title={'Leads'}>{customerLenght}</InfoCard>
        <InfoCard title={'Orders'}>{ordersLenght}</InfoCard>
      </div>
      <div className={cn('grap-6 m-5 grid grid-cols-2 space-x-8')}>
        <ScrollArea className={cn('h-80')}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={cn('text-left')}>Order ID</TableHead>
                <TableHead className={cn('text-left')}>Date</TableHead>
                <TableHead className={cn('text-left')}>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders &&
                orders.map((order: any) => (
                  <TableRow key={order.id} className={cn('child')}>
                    <td className={cn('text-left')}>{order.order_id}</td>
                    <td className={cn('text-left')}>{order.creation_date}</td>
                    <td className={cn('text-left')}>{order.amount}</td>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <ScrollArea className={cn('h-80')}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={cn('text-left')}>Order ID</TableHead>
                <TableHead className={cn('text-left')}>Date</TableHead>
                <TableHead className={cn('text-left')}>Status</TableHead>
                <TableHead className={cn('text-left')}>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders &&
                orders.map((order: any) => (
                  <TableRow key={order.id}>
                    <td className={cn('text-left')}>{order.id}</td>
                    <td className={cn('text-left')}>{order.date}</td>
                    <td className={cn('text-left')}>{order.status}</td>
                    <td className={cn('text-left')}>{order.total}</td>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  )
}

export default SummaryInfo
