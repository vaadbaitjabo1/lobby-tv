import { useState, useEffect } from 'react'

const API = 'https://www.hebcal.com/shabbat?cfg=json&latitude=32.0269&longitude=34.8219&tzid=Asia/Jerusalem&m=50&b=18'

function isShabbatTime() {
  const now  = new Date()
  const day  = now.getDay()
  const mins = now.getHours() * 60 + now.getMinutes()
  if (day === 5) return mins >= 7 * 60       // שישי מ-07:00
  if (day === 6) return mins <= 21 * 60      // שבת עד 21:00
  return false
}

function isSimMode() {
  if (typeof window === 'undefined') return false
  const hash   = window.location.hash
  const search = hash.includes('?') ? hash.split('?')[1] : ''
  return new URLSearchParams(search).get('sim') === 'shabbat'
}

export function useShabbat() {
  const [data, setData]   = useState(null)
  const [show, setShow]   = useState(() => isShabbatTime() || isSimMode())

  useEffect(() => {
    const id = setInterval(() => {
      setShow(isShabbatTime() || isSimMode())
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!show) return
    async function load() {
      try {
        const res  = await window.fetch(API)
        const json = await res.json()

        let candles = null, havdalah = null, parasha = null, parashaEn = null, memo = null
        for (const item of json.items ?? []) {
          if (item.category === 'candles')  candles   = item.title.replace('Candle lighting: ', '')
          if (item.category === 'havdalah') havdalah  = item.title.replace('Havdalah: ', '')
          if (item.category === 'parashat') {
            parasha   = item.hebrew ?? item.title
            parashaEn = item.title
            memo      = item.memo ?? null
          }
        }

        let parashaDesc = null
        if (parasha) {
          const controller = new AbortController()
          const timeout    = setTimeout(() => controller.abort(), 6000)
          try {
            const cleanName = parasha
              .replace(/־/g, ' ')
              .replace(/[֑-ֽֿ-ׇ]/g, '')
              .replace(/^פרשת\s+/u, '')
              .replace(/\s+/g, ' ')
              .trim()
            const wikiBase = 'https://he.wikipedia.org/api/rest_v1/page/summary/'
            let wikiRes = await window.fetch(wikiBase + encodeURIComponent('פרשת ' + cleanName), { signal: controller.signal })
            if (!wikiRes.ok) {
              const firstName = cleanName.split(' ')[0]
              wikiRes = await window.fetch(wikiBase + encodeURIComponent('פרשת ' + firstName), { signal: controller.signal })
            }
            if (wikiRes.ok) {
              const wikiData = await wikiRes.json()
              parashaDesc = wikiData.extract ?? null
            }
          } catch { /* שקט — timeout או שגיאת רשת */ }
          finally { clearTimeout(timeout) }
        }

        setData({ candles, havdalah, parasha, parashaEn, memo, parashaDesc })
      } catch { /* שקט */ }
    }
    load()
  }, [show])

  return { show, data }
}
