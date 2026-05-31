import { useState, useEffect, useRef } from 'react'

const YNET_RSS   = 'https://www.ynet.co.il/Integration/StoryRss2.xml'
const RSS2JSON   = url => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
const ALLORIGINS = url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
const REFRESH_MS = 30 * 60 * 1000  // רענון רגיל כל 30 דקות
const RETRY_MS   =  3 * 60 * 1000  // נסיון חוזר אחרי כישלון כל 3 דקות
const CACHE_KEY  = 'lobby_news_cache'

function parseXmlTitles(xml) {
  const matches = [...xml.matchAll(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/g)]
  if (matches.length > 1) return matches.slice(1).map(m => m[1].trim())
  const plain = [...xml.matchAll(/<title>([^<]+)<\/title>/g)]
  return plain.slice(1).map(m => m[1].trim())
}

function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') ?? [] } catch { return [] }
}
function saveCache(items) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(items)) } catch {}
}

export function useNewsTicker() {
  const [headlines, setHeadlines] = useState(loadCache)
  const retryRef = useRef(null)

  async function fetchNews() {
    const tryRss2json = fetch(RSS2JSON(YNET_RSS))
      .then(r => r.json())
      .then(data => {
        if (data.status !== 'ok' || !data.items?.length) throw new Error('empty')
        return data.items.map(i => i.title).filter(Boolean).slice(0, 20)
      })

    const tryAllorigins = fetch(ALLORIGINS(YNET_RSS))
      .then(r => r.json())
      .then(json => {
        const titles = parseXmlTitles(json.contents ?? '')
        if (!titles.length) throw new Error('empty')
        return titles.slice(0, 20)
      })

    try {
      const result = await Promise.any([tryRss2json, tryAllorigins])
      setHeadlines(result)
      saveCache(result)
      if (retryRef.current) { clearTimeout(retryRef.current); retryRef.current = null }
    } catch {
      // שניהם נכשלו — נסה שוב בעוד 3 דקות, Cache קיים ממשיך לרוץ
      if (!retryRef.current) {
        retryRef.current = setTimeout(() => { retryRef.current = null; fetchNews() }, RETRY_MS)
      }
    }
  }

  useEffect(() => {
    fetchNews()
    const id = setInterval(fetchNews, REFRESH_MS)
    return () => { clearInterval(id); if (retryRef.current) clearTimeout(retryRef.current) }
  }, [])

  return headlines
}
