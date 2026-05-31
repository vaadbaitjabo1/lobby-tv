import { useSettings } from '../contexts/SettingsContext'

const QR_API = (url, size) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=6&color=1a1a1a&bgcolor=ffffff&data=${encodeURIComponent(url)}`

export default function QRBox() {
  const settings = useSettings()

  const title  = settings.mgmt_title  || 'חברת ניהול'
  const text   = settings.mgmt_text   || 'לפתיחת קריאה לחברת הניהול,\nנא לסרוק את ה-QR'
  const qrUrl  = settings.mgmt_qr_url || 'https://wa.me/9721234567'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{
        background: '#2d2d2d',
        padding: '0.55rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>{title}</span>
        <span style={{ fontSize: '1rem' }}>🏢</span>
      </div>

      <div style={{
        flex: 1,
        background: '#f8f9fa',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.85rem 1rem',
        direction: 'rtl',
      }}>
        <div style={{
          flex: 1,
          fontSize: '1.1rem',
          color: '#1f2937',
          lineHeight: 1.7,
          fontWeight: 600,
          textAlign: 'right',
          whiteSpace: 'pre-line',
        }}>
          {text}
        </div>

        <img
          src={QR_API(qrUrl, 200)}
          alt="QR קוד"
          style={{
            width: '160px',
            height: '160px',
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
