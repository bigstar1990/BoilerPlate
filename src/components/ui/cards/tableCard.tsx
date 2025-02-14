import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table'
import BaseCard from './baseCard'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { cn } from '@/lib/utils'
import { Button } from '@/components/shadcn/button'

export type Row = {
  [key: string]: any
}

type TableCardProps = {
  className?: string
  title: string
  headers: {
    name: string
    cell?: (row: Row) => string | JSX.Element
    width?: string
  }[]
  data: Array<Row>
  pagination?: boolean
  handleNextPage?: () => void
  handlePrevPage?: () => void
}

export function TableCard(props: TableCardProps) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `${props.headers.map(({ width }) => width || '1fr').join(' ')}`,
  }

  return (
    <BaseCard className={props.className} title={props.title}>
      {/* <Table containerClassname={cn('h-full')} className={cn('block h-full')}> */}
      <Table className={cn('block h-full')}>
        <TableHeader className={cn('block')}>
          <TableRow style={gridStyle} className={cn('w-full')}>
            {props.headers.map(({ name }, i) => (
              <TableHead key={`${i}${name}`} className={cn('pt-3')}>
                {`${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`.replace(
                  '_',
                  ' '
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <ScrollArea className={cn('h-[calc(100%-3rem)] w-full')}>
          <TableBody className={cn('block h-full')}>
            {props?.data.map((row, i) => (
              <TableRow key={i} style={gridStyle} className={cn('h-12')}>
                {props.headers.map(({ name, cell }, j) => (
                  <TableCell
                    key={`${j}${name}cell`}
                    className={cn(
                      'inline-block overflow-hidden text-ellipsis whitespace-nowrap'
                    )}
                  >
                    {cell ? cell(row) : row[name]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {props.pagination && (
            <div className={cn('flex')}>
              <TableCell className={cn('w-full')}>
                <Button className={cn('w-full')} onClick={props.handlePrevPage}>
                  Prev
                </Button>
              </TableCell>
              <TableCell className={cn('w-full')}>
                <Button className={cn('w-full')} onClick={props.handleNextPage}>
                  Next
                </Button>
              </TableCell>
            </div>
          )}
        </ScrollArea>
      </Table>
    </BaseCard>
  )
}
