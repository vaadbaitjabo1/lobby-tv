import { createContext, useContext } from 'react'
import { useShabbat as _useShabbat } from '../hooks/useShabbat'

const ShabbatContext = createContext({ show: false, data: null })

export function ShabbatProvider({ children }) {
  const value = _useShabbat()
  return <ShabbatContext.Provider value={value}>{children}</ShabbatContext.Provider>
}

export function useShabbat() {
  return useContext(ShabbatContext)
}
