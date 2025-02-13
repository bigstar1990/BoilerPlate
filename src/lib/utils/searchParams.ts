export type booleanParamType = 'true' | 'false' | 'all'

export function getDefaultDate(searchParams: any): { from: Date; to: Date } {
  //from start of the week to now
  const defaultDate = {
    from: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())),
    to: new Date(),
  }
  return {
    from: searchParams.get('from')
      ? new Date(
          new Date(searchParams.get('from') as string).getFullYear(),
          new Date(searchParams.get('from') as string).getMonth(),
          new Date(searchParams.get('from') as string).getDate()
        )
      : defaultDate.from,
    to: searchParams.get('to')
      ? new Date(
          new Date(searchParams.get('to') as string).getFullYear(),
          new Date(searchParams.get('to') as string).getMonth(),
          new Date(searchParams.get('to') as string).getDate()
        )
      : defaultDate.to,
  }
}

export function getHasPaySource(searchParams: any): 'exist' | 'notexist' | 'all' {
  return searchParams.get('hasPaySource') ? searchParams.get('hasPaySource') : 'all'
}

export function getForgotten(searchParams: any): 'forgotten' | 'notforgotten' | 'all' {
  return searchParams.get('forgotten') ? searchParams.get('forgotten') : 'all'
}

export function setParams(data: any[]) {
  const searchParams = new URLSearchParams()

  data.forEach((item) => {
    if (item.value === 'none') {
      searchParams.delete(item.key)
    } else searchParams.set(item.key, item.value)
  })

  window.location.search = searchParams.toString()
}

export function getSchedulesParams(searchParams: any): string[] {
  return searchParams?.get('schedules') && searchParams?.get('schedules') !== ''
    ? searchParams.get('schedules').split(':')
    : []
}

export function getCampaignsParams(searchParams: any): string[] {
  return searchParams?.get('campaign_ids') && searchParams?.get('campaign_ids') !== ''
    ? searchParams.get('campaign_ids').split(':')
    : []
}
