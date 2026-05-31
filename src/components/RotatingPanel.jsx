import { useState, useEffect } from 'react'
import { useSportNews } from '../hooks/useSportNews'
import { useBirthdays } from '../hooks/useBirthdays'
import SectionHeader from './SectionHeader'

const ROTATE_MS = 10 * 60 * 1000

function switchMode(current) {
  return current === 'sport' ? 'birthdays' : 'sport'
}

export default function RotatingPanel() {
  const sport     = useSportNews()
  const birthdays = useBirthdays()
  const [mode, setMode]       = useState('sport')
  const [visible, setVisible] = useState(true)

  function doSwitch() {
    setVisible(false)
    setTimeout(() => { setMode(m => switchMode(m)); setVisible(true) }, 400)
  }

  useEffect(() => {
    const id = setInterval(doSwitch, ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  const isSport = mode === 'sport'
  const label   = isSport ? 'ONE ספורט' : 'נולדו היום'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <SectionHeader>{label}</SectionHeader>

        {/* נקודות — לחיצה מחליפה ידנית */}
        <div style={{ display: 'flex', gap: '5px', cursor: 'pointer', padding: '4px' }} onClick={doSwitch} title="לחץ למעבר">
          {['sport', 'birthdays'].map(m => (
            <div key={m} style={{
              width: m === mode ? '20px' : '7px', height: '7px',
              borderRadius: '999px', transition: 'all 0.35s ease',
              background: m === mode ? 'var(--color-gold)' : 'var(--color-gold-muted)',
            }} />
          ))}
        </div>
      </div>

      {isSport ? <SportList items={sport} /> : <BirthdayList people={birthdays} />}
    </div>
  )
}

function SportList({ items }) {
  if (!items.length) return (
    <div style={{ color: 'var(--color-muted)', fontSize: '0.9rem', padding: '0.5rem 0' }}>טוען חדשות ספורט…</div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
          padding: '0.5rem 0.75rem', boxShadow: 'var(--shadow-card)',
          borderRight: '3px solid var(--color-gold-muted)',
        }}>
          {item.thumbnail && (
            <img src={item.thumbnail} alt="" width={48} height={36}
              style={{ borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />
          )}
          <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--color-anthracite)', lineHeight: 1.4 }}>
            {item.title}
          </div>
        </div>
      ))}
    </div>
  )
}

function BirthdayList({ people }) {
  const today = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'long' })
  if (!people.length) return (
    <div style={{ color: 'var(--color-muted)', fontSize: '0.9rem', padding: '0.5rem 0' }}>טוען…</div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{today}</div>
      {people.map(p => (
        <div key={p.name} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
          padding: '0.5rem 0.75rem', boxShadow: 'var(--shadow-card)',
        }}>
          <img src={p.thumb} alt={p.name} width={44} height={44}
            style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--color-gold-muted)' }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-anthracite)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {p.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
              {p.description} · {p.year}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
