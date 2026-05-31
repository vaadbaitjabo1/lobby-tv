import { useShabbat } from '../hooks/useShabbat'

export default function ShabbatWidget({ dark }) {
  const { show, data } = useShabbat()
  if (!show) return null

  const containerStyle = dark
    ? {
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.1rem',
        borderRight: '4px solid var(--color-accent-light)',
      }
    : {
        background: 'linear-gradient(135deg, #fffbef 0%, #fff8e1 100%)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.1rem',
        borderRight: '4px solid var(--color-gold)',
        boxShadow: 'var(--shadow-card)',
      }

  return (
    <div style={containerStyle}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.65rem',
        borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.2)' : 'var(--color-gold-muted)'}`,
        paddingBottom: '0.5rem',
      }}>
        <span style={{ fontSize: '1.3rem' }}>🕯️</span>
        <h2 style={{
          margin: 0,
          fontSize: '1.1rem',
          fontWeight: 700,
          color: dark ? '#fff' : 'var(--color-anthracite)',
          fontFamily: 'var(--font-display)',
        }}>
          שבת שלום
        </h2>
      </div>

      {data ? (
        <>
          <Row label="כניסת שבת" value={data.candles} dark={dark} />
          <Row label="צאת שבת"   value={data.havdalah} dark={dark} />
          {data.parasha && <Row label="פרשת השבוע" value={data.parasha} dark={dark} />}
          {data.mussar && (
            <div style={{
              marginTop: '0.65rem',
              paddingTop: '0.65rem',
              borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.2)' : 'var(--color-gold-muted)'}`,
              fontSize: '0.85rem',
              color: dark ? 'rgba(255,255,255,0.7)' : 'var(--color-charcoal)',
              fontStyle: 'italic',
              lineHeight: 1.5,
            }}>
              "{data.mussar}"
            </div>
          )}
        </>
      ) : (
        <div style={{ color: dark ? 'rgba(255,255,255,0.5)' : 'var(--color-muted)', fontSize: '0.9rem' }}>טוען…</div>
      )}
    </div>
  )
}

function Row({ label, value, dark }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', marginBottom: '0.3rem' }}>
      <span style={{ color: dark ? 'rgba(255,255,255,0.6)' : 'var(--color-muted)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: dark ? '#fff' : 'var(--color-anthracite)' }}>{value}</span>
    </div>
  )
}
