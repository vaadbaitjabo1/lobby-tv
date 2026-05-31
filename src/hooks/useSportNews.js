import { useState, useEffect } from 'react'

// Google News RSS מאגד ידיעות מ-one.co.il ללא צורך ב-RSS ישיר
const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=' +
  encodeURIComponent('https://news.google.com/rss/search?q=site:one.co.il&hl=iw&gl=IL&ceid=IL:iw')

const REFRESH_MS = 10 * 60 * 1000

export function useSportNews() {
  const [items, setItems] = useState([])

  async function fetchNews() {
    try {
      const res  = await fetch(RSS2JSON)
      const data = await res.json()
      if (data.status === 'ok' && data.items?.length) {
        setItems(data.items.slice(0, 6).map(i => ({
          title:     i.title.replace(/\s*-\s*ONE.*$/i, '').trim(),
          thumbnail: i.thumbnail || null,
        })).filter(i => i.title))
      }
    } catch { /* שקט */ }
  }

  useEffect(() => {
    fetchNews()
    const id = setInterval(fetchNews, REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  return items
}
