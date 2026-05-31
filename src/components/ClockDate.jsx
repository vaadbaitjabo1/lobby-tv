import { useClock } from '../hooks/useClock'

export default function ClockDate({ dark, compact }) {
  const { time, gregorian, dayName, hebrew } = useClock()
  const c = dark
    ? { time: '#fff', day: '#93c5fd', date: 'rgba(255,255,255,0.75)', heb: 'rgba(255,255,255,0.5)' }
    : { time: 'var(--color-primary)', day: 'var(--color-accent)', date: 'var(--color-charcoal)', heb: 'var(--color-muted)' }

  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
        <div style={{ fontSize: '2.8rem', fontWeight: 800, color: c.time, letterSpacing: '-0.02em', lineHeight: 1 }}>
          {time}
        </div>
        <div style={{ fontSize: '0.88rem', color: c.day, fontWeight: 600 }}>יום {dayName} · {gregorian}</div>
        <div style={{ fontSize: '0.78rem', color: c.heb }}>{hebrew}</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
      <div style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1, color: c.time, letterSpacing: '-0.02em' }}>
        {time}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.1rem', color: c.day, fontWeight: 600 }}>יום {dayName}</span>
        <span style={{ fontSize: '1rem', color: c.date }}>{gregorian}</span>
      </div>
      <div style={{ fontSize: '0.9rem', color: c.heb }}>{hebrew}</div>
    </div>
  )
}
