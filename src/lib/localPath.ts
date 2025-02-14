export const getPathnameWithoutLocale = (pn: string) =>
  `/${pn.split('/').slice(2).join('/')}`
export const getLocale = (pn: string) => pn.split('/')[1]
