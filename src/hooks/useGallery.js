import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useGallery() {
  const [items, setItems] = useState([])

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('gallery')
        .select('*')
        .eq('active', true)
        .order('sort_order')
      if (data) setItems(data)
    }
    fetch()

    const channel = supabase
      .channel('gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, fetch)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return items
}
