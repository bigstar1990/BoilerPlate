import 'server-only'

import locales from './locales.json'

import * as dict from './en.json'

const dictionaries = Object.keys(locales).reduce(
  (acc, locale) => {
    acc[locale] = () =>
      import(`./${locale}.json`).then((module) => module.default)
    return acc
  },
  {} as { [key: string]: () => Promise<typeof dict> }
)

export const getDictionary = async (locale: string) => dictionaries[locale]()
