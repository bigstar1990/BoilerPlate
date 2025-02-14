type item = {
  id: string
  name: string
  accessorFn?: (item: any) => any
  [key: string]: any
}

export default item
