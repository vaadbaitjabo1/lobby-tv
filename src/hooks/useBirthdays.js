import { useState, useEffect } from 'react'

export function useBirthdays() {
  const [people, setPeople] = useState([])

  useEffect(() => {
    async function load() {
      const now   = new Date()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day   = String(now.getDate()).padStart(2, '0')

      try {
        const data = await fetch(
          `https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${month}/${day}`
        ).then(r => r.json())

        const picks = (data.births ?? [])
          .filter(b => {
            const p = b.pages?.[0]
            return p?.thumbnail?.source && p?.extract && p.thumbnail.width >= 100
          })
          // מיון לפי פופולריות: רוחב תמונה + אורך הכתבה
          .sort((a, b) => {
            const score = item => (item.pages[0].thumbnail?.width || 0) * 2 + (item.pages[0].extract?.length || 0) / 5
            return score(b) - score(a)
          })
          .slice(0, 3)
          .map(b => ({
            name:        b.pages[0].titles.normalized,
            description: b.pages[0].description,
            thumb:       b.pages[0].thumbnail.source,
            year:        b.year,
          }))

        if (picks.length) setPeople(picks)
      } catch { /* שקט */ }
    }
    load()
  }, [])

  return people
}
