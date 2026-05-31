import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useAnnouncements() {
  const [items, setItems] = useState([])
  const loadingRef = useRef(false)

  useEffect(() => {
    async function load() {
      if (loadingRef.current) return
      loadingRef.current = true
      try {
        const { data } = await supabase
          .from('announcements')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })
        if (data) setItems(data)
      } finally {
        loadingRef.current = false
      }
    }
    load()

    const channel = supabase
      .channel('announcements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, load)
      .subscribe()

    const poll = setInterval(load, 30000)

    return () => { supabase.removeChannel(channel); clearInterval(poll) }
  }, [])

  return items
}
