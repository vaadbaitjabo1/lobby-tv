import { useWeather } from '../hooks/useWeather'

const EMOJI = {
  '01': '☀️', '02': '⛅', '03': '☁️', '04': '☁️',
  '09': '🌧️', '10': '🌦️', '11': '⛈️', '13': '❄️', '50': '🌫️',
}

export default function Weather({ dark, compact }) {
  const { weather, error } = useWeather()
  const c = dark
    ? { temp: '#fff', desc: 'rgba(255,255,255,0.8)', meta: 'rgba(255,255,255,0.55)' }
    : { temp: 'var(--color-primary)', desc: 'var(--color-charcoal)', meta: 'var(--color-muted)' }

  if (error) return null
  if (!weather) return (
    <div style={{ color: c.meta, fontSize: '0.9rem' }}>טוען…</div>
  )

  const emoji = EMOJI[weather.icon.slice(0, 2)] ?? '🌡️'

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', direction: 'rtl' }}>
        <span style={{ fontSize: '2.6rem', lineHeight: 1 }}>{emoji}</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: c.temp, lineHeight: 1 }}>
            {weather.temp}°
          </div>
          <div style={{ fontSize: '0.78rem', color: c.meta }}>
            {weather.desc}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', direction: 'rtl' }}>
      <span style={{ fontSize: '3.5rem', lineHeight: 1 }}>{emoji}</span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '2.8rem', fontWeight: 700, color: c.temp, lineHeight: 1 }}>
          {weather.temp}°
        </div>
        <div style={{ fontSize: '0.95rem', color: c.desc }}>{weather.desc}</div>
        <div style={{ fontSize: '0.85rem', color: c.meta }}>
          לחות {weather.humidity}% · רוח {weather.wind} קמ״ש
        </div>
      </div>
    </div>
  )
}
