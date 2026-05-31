import { useAnnouncements } from '../hooks/useAnnouncements'

export default function Announcements({ dark }) {
  const items = useAnnouncements()

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      overflow: 'hidden',
      minHeight: 0,
    }}>
      {/* כותרת */}
      <div style={{
        background: 'var(--color-primary)',
        padding: '0.55rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.04em' }}>
          הודעות לדיירים
        </span>
        <span style={{ fontSize: '1.1rem' }}>📋</span>
      </div>

      {/* רשימת הודעות */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0.6rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        background: '#fff',
      }}>
        {items.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-muted)',
            fontSize: '0.9rem',
            opacity: 0.6,
          }}>
            אין הודעות כרגע
          </div>
        ) : (() => {
          const titleSize = Math.max(0.95, Math.min(1.55, 3.5 / items.length)) + 'rem'
          const bodySize  = Math.max(0.82, Math.min(1.2,  2.8 / items.length)) + 'rem'
          const padding   = items.length <= 2 ? '0.9rem 1rem' : '0.65rem 0.9rem'
          return items.map(item => (
            <div key={item.id} style={{
              background: '#f8faff',
              borderRadius: '0.6rem',
              padding,
              border: '1.5px solid rgba(13,45,107,0.13)',
              borderRight: '4px solid var(--color-primary)',
              boxShadow: '0 1px 6px rgba(13,45,107,0.07)',
            }}>
              <div style={{
                fontWeight: 700,
                fontSize: titleSize,
                color: 'var(--color-primary)',
                marginBottom: '0.2rem',
                lineHeight: 1.35,
              }}>
                {item.title}
              </div>
              {item.body && (
                <div style={{
                  fontSize: bodySize,
                  color: 'var(--color-charcoal)',
                  lineHeight: 1.55,
                }}>
                  {item.body}
                </div>
              )}
            </div>
          ))
        })()}
      </div>
    </div>
  )
}
