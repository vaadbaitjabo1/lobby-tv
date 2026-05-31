import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useBusinesses() {
  const [businesses, setBusinesses] = useState([])
  const loadingRef = useRef(false)

  useEffect(() => {
    async function load() {
      if (loadingRef.current) return
      loadingRef.current = true
      try {
        const { data } = await supabase
          .from('businesses')
          .select('*')
          .eq('active', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: true })
        if (data) setBusinesses(data)
      } finally {
        loadingRef.current = false
      }
    }
    load()

    const channel = supabase
      .channel('businesses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'businesses' }, load)
      .subscribe()

    const poll = setInterval(load, 30000)

    return () => { supabase.removeChannel(channel); clearInterval(poll) }
  }, [])

  return businesses
}
