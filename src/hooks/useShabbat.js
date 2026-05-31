import { useState, useEffect } from 'react'

const API = 'https://www.hebcal.com/shabbat?cfg=json&latitude=32.0269&longitude=34.8219&tzid=Asia/Jerusalem&m=50&b=18'

function isShabbatTime() {
  const d = new Date().getDay()
  return d === 5 || d === 6   // שישי או שבת
}

function isSimMode() {
  return typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('sim') === 'shabbat'
}

export function useShabbat() {
  const [data, setData]   = useState(null)
  const [show, setShow]   = useState(() => isShabbatTime() || isSimMode())

  useEffect(() => {
    // עדכון show כל דקה (למקרה שעבר חצות)
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
          try {
            const cleanName = parasha
              .replace(/־/g, ' ')
              .replace(/[֑-ֽֿ-ׇ]/g, '')
              .replace(/^פרשת\s+/u, '')
              .replace(/\s+/g, ' ')
              .trim()
            const wikiBase = 'https://he.wikipedia.org/api/rest_v1/page/summary/'
            let wikiRes = await window.fetch(wikiBase + encodeURIComponent('פרשת ' + cleanName))
            if (!wikiRes.ok) {
              // פרשה כפולה (בהר בחקתי) — נסה רק שם ראשון
              const firstName = cleanName.split(' ')[0]
              wikiRes = await window.fetch(wikiBase + encodeURIComponent('פרשת ' + firstName))
            }
            if (wikiRes.ok) {
              const wikiData = await wikiRes.json()
              parashaDesc = wikiData.extract ?? null
            }
          } catch { /* שקט */ }
        }

        setData({ candles, havdalah, parasha, parashaEn, memo, parashaDesc })
      } catch { /* שקט */ }
    }
    load()
  }, [show])

  return { show, data }
}
