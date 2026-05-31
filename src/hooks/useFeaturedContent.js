import { useState, useEffect } from 'react'

const RSS2JSON   = url => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
const ALLORIGINS = url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
const REFRESH_MS = 30 * 60 * 1000

function upgradeImageQuality(url) {
  if (!url) return url
  // ynet CDN: _small/_medium → _large לאיכות גבוהה יותר
  if (url.includes('yit.co.il') || url.includes('ynet')) {
    return url.replace(/_(small|medium)\.(jpe?g|png|webp)$/i, '_large.$2')
  }
  return url
}

// תמונה: בודק thumbnail → enclosure → <img> ב-content → <img> ב-description
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

// חותך בסוף משפט שלם, לא באמצע מילה
function extractSummary(html, maxChars = 300) {
  const text = stripHtml(html)
  if (!text || text.length < 20) return ''
  if (text.length <= maxChars) return text
  const portion = text.slice(0, maxChars)
  // מחפש נקודת סיום אחרונה — נקודה, שאלה, קריאה
  const lastEnd = Math.max(
    portion.lastIndexOf('.'),
    portion.lastIndexOf('?'),
    portion.lastIndexOf('!'),
    portion.lastIndexOf('׃'),
  )
  if (lastEnd > maxChars * 0.45) return text.slice(0, lastEnd + 1).trim()
  // fallback — גזור בסוף מילה
  const lastSpace = portion.lastIndexOf(' ')
  return text.slice(0, lastSpace > 0 ? lastSpace : maxChars).trim() + '…'
}

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

/* ── YNET ספורט (StoryRss3) ── */
async function fetchSport() {
  return fetchYnet(3, 'ynet ספורט', '#b91c1c')
}

/* ── YNET כלכלה (StoryRss6) ── */
async function fetchEconomy() {
  return fetchYnet(6, 'ynet כלכלה', '#15532e')
}

function firstSentences(text, n = 2) {
  if (!text) return ''
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? []
  return sentences.slice(0, n).join(' ').trim()
}

/* ── נולדו היום ── */
async function getHebDesc(enTitle) {
  try {
    const langData = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(enTitle)}&prop=langlinks&lllang=he&format=json&origin=*`
    ).then(r => r.json())
    const heTitle = Object.values(langData.query?.pages ?? {})[0]?.langlinks?.[0]?.['*']
    if (!heTitle) return null
    const { extract } = await fetch(
      `https://he.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(heTitle)}`
    ).then(r => r.json())
    return extract ? firstSentences(extract, 2) : null
  } catch { return null }
}

async function fetchBirthdays() {
  const now   = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day   = String(now.getDate()).padStart(2, '0')
  const data  = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${month}/${day}`).then(r => r.json())

  const candidates = (data.births ?? [])
    .filter(b => {
      const p = b.pages?.[0]
      return p?.thumbnail?.source && p.thumbnail.width >= 200 && p.extract?.length >= 500
    })
    .sort((a, b) => {
      const score = item => (item.pages[0].thumbnail?.width || 0) * 3 + (item.pages[0].extract?.length || 0) / 4
      return score(b) - score(a)
    })
    .slice(0, 8)

  const withHebrew = await Promise.all(candidates.map(async b => {
    const page   = b.pages[0]
    const heDesc = await getHebDesc(page.titles.normalized)
    return { b, page, heDesc, hasHebrew: !!heDesc }
  }))

  // מעדיף ידוענים עם ערך בוויקיפדיה עברית
  const sorted = [...withHebrew].sort((a, b) => Number(b.hasHebrew) - Number(a.hasHebrew))
  const top = sorted.slice(0, 3)

  return top.map(({ b, page, heDesc }) => {
    const yearHe = b.year ? ` (נולד ב-${b.year})` : ''
    return {
      source: 'נולדו היום', sourceColor: '#4c1d95',
      title:       page.titles.normalized,
      description: (heDesc ?? firstSentences(page.extract, 2)) + yearHe,
      image:       page.thumbnail.source.replace(/\/\d+px-/, '/400px-'),
    }
  })
}

export function useFeaturedContent() {
  const [items, setItems] = useState([])

  async function load() {
    const [sport, eco, bdays] = await Promise.allSettled([
      fetchSport(), fetchEconomy(), fetchBirthdays(),
    ])
    const a = sport.status === 'fulfilled' ? sport.value : []
    const b = eco.status   === 'fulfilled' ? eco.value   : []
    const c = bdays.status === 'fulfilled' ? bdays.value : []

    // ספורט, כלכלה, ספורט, יומולדת, כלכלה…
    const merged = []
    const max = Math.max(a.length, b.length, c.length)
    for (let i = 0; i < max; i++) {
      if (a[i]) merged.push(a[i])
      if (b[i]) merged.push(b[i])
      if (c[i]) merged.push(c[i])
    }
    if (merged.length) setItems(merged)
  }

  useEffect(() => {
    load()
    const id = setInterval(load, REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  return items
}
