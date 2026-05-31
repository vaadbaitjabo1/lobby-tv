const MANAGEMENT_URL = 'https://wa.me/9721234567'

const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=6&color=1a1a1a&bgcolor=ffffff&data=${encodeURIComponent(MANAGEMENT_URL)}`

export default function QRBox() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* כותרת */}
      <div style={{
        background: '#2d2d2d',
        padding: '0.55rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>חברת ניהול</span>
        <span style={{ fontSize: '1rem' }}>🏢</span>
      </div>

      {/* גוף — QR משמאל, טקסט מימין */}
      <div style={{
        flex: 1,
        background: '#f8f9fa',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        direction: 'rtl',
      }}>
        {/* טקסט — ימין */}
        <div style={{
          flex: 1,
          fontSize: '1.05rem',
          color: '#1f2937',
          lineHeight: 1.7,
          fontWeight: 600,
          textAlign: 'right',
        }}>
          לפתיחת קריאה לחברת הניהול,<br />
          נא לסרוק את ה-QR
        </div>

        {/* QR — שמאל */}
        <img
          src={QR_SRC}
          alt="QR קוד"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '8px',
            border: '2px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  )
}
