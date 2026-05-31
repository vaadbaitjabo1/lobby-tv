import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAnnouncements() {
  const [items, setItems] = useState([])

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
      if (data) setItems(data)
    }
    fetch()

    const channel = supabase
      .channel('announcements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, fetch)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return items
}
