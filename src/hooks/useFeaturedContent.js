import { useState, useEffect, useRef } from 'react'

const RSS2JSON      = url => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
const REFRESH_MS    = 30 * 60 * 1000
const BDAY_RETRY_MS = 20 * 1000

// ─── Image quality upgrade ────────────────────────────────────────────────────
function upgradeImageQuality(url) {
  if (!url) return url
  if (url.includes('yit.co.il') || url.includes('ynet.co.il')) {
    url = url.replace(/_(small|medium)\.(jpe?g|png|webp)$/i, '_large.$2')
    url = url.replace(/([?&])(w|width)=\d+/gi, '$11080')
    return url
  }
  if (url.includes('upload.wikimedia.org') && url.includes('/thumb/')) {
    return url.replace('/thumb/', '/').replace(/\/\d+px-[^/]+$/, '')
  }
  return url
}

// ─── RSS helpers ──────────────────────────────────────────────────────────────
function extractImage(item) {
  if (item.thumbnail && item.thumbnail.length > 10) return upgradeImageQuality(item.thumbnail)
  if (item.enclosure?.link) return upgradeImageQuality(item.enclosure.link)
  const fromContent = (item.content ?? '').match(/<img[^>]+src=["']([^"']+)["']/i)
  if (fromContent?.[1]) return upgradeImageQuality(fromContent[1])
  const fromDesc = (item.description ?? '').match(/<img[^>]+src=["']([^"']+)["']/i)
  return fromDesc?.[1] ? upgradeImageQuality(fromDesc[1]) : null
}

function stripHtml(html) {
  return (html ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function extractSummary(html, maxChars = 300) {
  const text = stripHtml(html)
  if (!text || text.length < 20) return ''
  if (text.length <= maxChars) return text
  const portion = text.slice(0, maxChars)
  const lastEnd = Math.max(
    portion.lastIndexOf('.'),
    portion.lastIndexOf('?'),
    portion.lastIndexOf('!'),
    portion.lastIndexOf('׃'),
  )
  if (lastEnd > maxChars * 0.45) return text.slice(0, lastEnd + 1).trim()
  const lastSpace = portion.lastIndexOf(' ')
  return text.slice(0, lastSpace > 0 ? lastSpace : maxChars).trim() + '…'
}

function firstSentences(text, n = 2) {
  if (!text) return ''
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? []
  return sentences.slice(0, n).join(' ').trim()
}

// ─── Data fetchers ────────────────────────────────────────────────────────────
async function fetchYnet(rssId, source, sourceColor) {
  const url  = `https://www.ynet.co.il/Integration/StoryRss${rssId}.xml`
  const res  = await fetch(RSS2JSON(url))
  const data = await res.json()
  if (data.status !== 'ok' || !data.items?.length) throw new Error('empty')
  return data.items.slice(0, 3).map(i => ({
    source,
    sourceColor,
    title:       i.title?.trim() ?? '',
    description: extractSummary(i.description || i.content),
    image:       extractImage(i),
  })).filter(i => i.title)
}

async function fetchSport()   { return fetchYnet(3, 'ynet ספורט', '#b91c1c') }
async function fetchEconomy() { return fetchYnet(6, 'ynet כלכלה', '#15532e') }

const BDAY_API = 'https://api-v2.appdeploy.ai/app/e52860b99a4f4b8c84/api/born-today'

// ─── Birthdays via AppDeploy backend (Hebrew, AI-generated) ──────────────────
async function fetchBirthdays() {
  const { data } = await fetch(BDAY_API).then(async r => {
    const d = await r.json()
    return { data: d }
  })
  if (!Array.isArray(data) || data.length === 0) return []
  return data.map(item => ({
    source:      'נולדו היום',
    sourceColor: '#4c1d95',
    title:       item.name,
    description: item.description,
    image:       upgradeImageQuality(item.image_url),
    birthYear:   item.birth_year,
  }))
}

// ─── Build rotation sequence ──────────────────────────────────────────────────
// Pattern: sport1 › eco1 › bday1 › sport2 › eco2 › bday2 › …
function buildSequence(sport, eco, bdays) {
  if (!bdays.length) {
    const merged = []
    const max = Math.max(sport.length, eco.length)
    for (let i = 0; i < max; i++) {
      if (sport[i]) merged.push(sport[i])
      if (eco[i])   merged.push(eco[i])
    }
    return merged
  }
  const sequence = []
  for (let i = 0; i < bdays.length; i++) {
    if (sport.length > 0) sequence.push(sport[i % sport.length])
    if (eco.length   > 0) sequence.push(eco[i   % eco.length])
    sequence.push(bdays[i])
  }
  return sequence
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useFeaturedContent() {
  const [items, setItems] = useState([])
  const retryRef = useRef(null)

  async function retryBirthdays() {
    try {
      const bdays = await fetchBirthdays()
      if (!bdays.length) return
      setItems(prev => {
        if (!prev.length) return prev
        const sport = prev.filter(i => i.source === 'ynet ספורט')
        const eco   = prev.filter(i => i.source === 'ynet כלכלה')
        return buildSequence(sport, eco, bdays)
      })
    } catch {}
  }

  async function load() {
    const [sport, eco, bdays] = await Promise.allSettled([
      fetchSport(), fetchEconomy(), fetchBirthdays(),
    ])
    const a = sport.status === 'fulfilled' ? sport.value : []
    const b = eco.status   === 'fulfilled' ? eco.value   : []
    const c = bdays.status === 'fulfilled' ? bdays.value : []

    const merged = buildSequence(a, b, c)
    if (merged.length) setItems(merged)

    if (c.length === 0 && !retryRef.current) {
      retryRef.current = setTimeout(() => {
        retryRef.current = null
        retryBirthdays()
      }, BDAY_RETRY_MS)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, REFRESH_MS)
    return () => {
      clearInterval(id)
      if (retryRef.current) { clearTimeout(retryRef.current); retryRef.current = null }
    }
  }, [])

  return items
}
