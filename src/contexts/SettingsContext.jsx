import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const SettingsContext = createContext({})

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('settings').select('key, value')
      if (data) setSettings(Object.fromEntries(data.map(r => [r.key, r.value])))
    }
    load()

    const channel = supabase
      .channel('settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, load)
      .subscribe()

    const poll = setInterval(load, 30000)

    return () => { supabase.removeChannel(channel); clearInterval(poll) }
  }, [])

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}
