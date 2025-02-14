'use client'

import { createContext, useContext } from 'react'
import en from './en.json'

const DictionaryContext = createContext(en)

type DictionaryProviderProps = {
  children: React.ReactNode
  dictionary: typeof en
}

export const DictionaryProvider = (props: DictionaryProviderProps) => {
  return (
    <DictionaryContext.Provider value={props.dictionary}>
      {props.children}
    </DictionaryContext.Provider>
  )
}

export const useDictionary = () => {
  return useContext(DictionaryContext)
}
