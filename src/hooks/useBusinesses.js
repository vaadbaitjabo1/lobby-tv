import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useBusinesses() {
  const [businesses, setBusinesses] = useState([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true })
      if (data) setBusinesses(data)
    }
    load()

    const channel = supabase
      .channel('businesses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'businesses' }, load)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return businesses
}
