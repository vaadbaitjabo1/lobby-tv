import { useState, useEffect, useRef } from 'react'

const YNET_RSS        = 'https://www.ynet.co.il/Integration/StoryRss2.xml'
const RSS2JSON        = url => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
const ALLORIGINS      = url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
const REFRESH_NEWS_MS = 30 * 60 * 1000
const REFRESH_MKT_MS  =  5 * 60 * 1000
const RETRY_MS        =  3 * 60 * 1000
const CACHE_KEY       = 'lobby_news_cache'

const MARKET_SYMBOLS = [
  { symbol: 'USDILS=X', label: 'דולר'   },
  { symbol: 'EURILS=X', label: 'יורו'   },
  { symbol: 'TA35.TA',  label: 'ת"א 35' },
  { symbol: '^GSPC',    label: 'S&P 500' },
]

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

const escHtml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function formatQuote(q) {
  const isFX  = q.symbol.includes('ILS')
  const price = isFX
    ? '₪' + q.price.toFixed(3)
    : Math.round(q.price).toLocaleString('en-US')

  let changePart = ''
  if (q.change != null) {
    const isPos = q.change >= 0
    const arrow = isPos ? '▲' : '▼'
    const pct   = Math.abs(q.change).toFixed(1) + '%'
    const color = isPos ? '#4ade80' : '#f87171'
    changePart  = ` <span style="color:${color}">${arrow}${pct}</span>`
  }

  if (q.symbol === 'USDILS=X') {
    return `<span dir="ltr">${escHtml(price)}${changePart} : <span style="color:#4ade80">$</span> 💵</span>`
  }
  if (q.symbol === 'EURILS=X') {
    return `<span dir="ltr">${escHtml(price)}${changePart} : <span style="color:#f59e0b">€</span> 💶</span>`
  }
  const changeLeft = changePart ? changePart.trimStart() + ' ' : ''
  return `<span dir="ltr">${changeLeft}${escHtml(price)} : ${escHtml(q.label)} 📈</span>`
}

async function fetchMarket() {
  const results = []
  for (const { symbol, label } of MARKET_SYMBOLS) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`
      const res = await fetch(ALLORIGINS(url))
      if (!res.ok) continue
      const raw   = await res.json()
      const chart = JSON.parse(raw.contents)?.chart?.result?.[0]
      if (!chart) continue
      const price  = chart.meta?.regularMarketPrice
      const prev   = chart.meta?.chartPreviousClose
      const change = (price != null && prev) ? ((price - prev) / prev * 100) : null
      if (price != null) results.push({ symbol, label, price, change })
    } catch { /* שקט */ }
  }
  return results
}

export function useNewsTicker() {
  const [headlines,   setHeadlines]   = useState(loadCache)
  const [marketItems, setMarketItems] = useState([])
  const retryRef = useRef(null)

  async function fetchNews() {
    try {
      const data = await fetch(RSS2JSON(YNET_RSS)).then(r => r.json())
      if (data.status !== 'ok' || !data.items?.length) throw new Error('empty')
      const result = data.items.map(i => i.title).filter(Boolean).slice(0, 20)
      setHeadlines(result)
      saveCache(result)
      if (retryRef.current) { clearTimeout(retryRef.current); retryRef.current = null }
      return
    } catch {}

    try {
      const text = await fetch(ALLORIGINS(YNET_RSS)).then(r => r.text())
      let json
      try { json = JSON.parse(text) } catch { throw new Error('allorigins non-json') }
      const titles = parseXmlTitles(json.contents ?? '')
      if (!titles.length) throw new Error('empty')
      setHeadlines(titles.slice(0, 20))
      saveCache(titles.slice(0, 20))
      if (retryRef.current) { clearTimeout(retryRef.current); retryRef.current = null }
    } catch {
      if (!retryRef.current) {
        retryRef.current = setTimeout(() => { retryRef.current = null; fetchNews() }, RETRY_MS)
      }
    }
  }

  async function refreshMarket() {
    try {
      const quotes = await fetchMarket()
      if (quotes.length) setMarketItems(quotes.map(formatQuote))
    } catch { /* טיקר ממשיך בלי שערים */ }
  }

  useEffect(() => {
    fetchNews()
    refreshMarket()
    const newsId = setInterval(fetchNews,     REFRESH_NEWS_MS)
    const mktId  = setInterval(refreshMarket, REFRESH_MKT_MS)
    return () => {
      clearInterval(newsId)
      clearInterval(mktId)
      if (retryRef.current) clearTimeout(retryRef.current)
    }
  }, [])

  return [...marketItems, ...headlines.map(escHtml)]
}
