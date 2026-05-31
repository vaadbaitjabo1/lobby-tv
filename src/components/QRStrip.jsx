// ← שנה את ה-URL כאן לכתובת חברת הניהול
const MANAGEMENT_URL = 'https://wa.me/9721234567'
const MANAGEMENT_LABEL = 'פנייה לחברת הניהול'

const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&margin=4&color=0d2d6b&data=${encodeURIComponent(MANAGEMENT_URL)}`

export default function QRStrip() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.65rem',
      padding: '0.3rem 0.9rem',
      background: '#f0f4ff',
      borderTop: '1px solid rgba(13,45,107,0.12)',
      flexShrink: 0,
    }}>
      <img
        src={QR_SRC}
        alt="QR קוד"
        width={46}
        height={46}
        style={{ borderRadius: '4px', flexShrink: 0 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.05rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
          {MANAGEMENT_LABEL}
        </div>
        <div style={{ fontSize: '0.62rem', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
          סרוק לפנייה מהירה
        </div>
      </div>
    </div>
  )
}
