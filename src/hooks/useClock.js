import { useState, useEffect } from 'react'
import { HDate } from '@hebcal/core'

const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

function hebrewDate(d) {
  const hd = new HDate(d)
  return hd.renderGematriya()
}

export function useClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', hour12: false })
  const gregorian = now.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })
  const dayName = DAYS_HE[now.getDay()]
  const hebrew = hebrewDate(now)

  return { time, gregorian, dayName, hebrew }
}
