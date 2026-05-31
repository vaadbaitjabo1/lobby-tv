import { useBirthdays } from '../hooks/useBirthdays'

export default function Birthdays() {
  const people = useBirthdays()
  if (!people.length) return null

  const today = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'long' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {/* כותרת */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        paddingBottom: '0.4rem',
        borderBottom: '2px solid var(--color-gold)',
      }}>
        <span style={{ fontSize: '1.2rem' }}>🎂</span>
        <h2 style={{
          margin: 0,
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--color-anthracite)',
          fontFamily: 'var(--font-display)',
        }}>
          נולדו היום — {today}
        </h2>
      </div>

      {/* כרטיסים */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {people.map(p => (
          <div key={p.name} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 0.75rem',
            boxShadow: 'var(--shadow-card)',
          }}>
            <img
              src={p.thumb}
              alt={p.name}
              width={44}
              height={44}
              style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--color-gold-muted)' }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-anthracite)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                {p.description} · {p.year}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
