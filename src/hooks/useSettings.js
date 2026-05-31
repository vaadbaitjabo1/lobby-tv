import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useSettings() {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('settings').select('key, value')
      if (data) setSettings(Object.fromEntries(data.map(r => [r.key, r.value])))
    }
    fetch()

    const channel = supabase
      .channel('settings-' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, fetch)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return settings
}
