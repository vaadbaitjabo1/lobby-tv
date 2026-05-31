import IsraelFlag from './IsraelFlag'

export default function WelcomeBanner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
      <IsraelFlag />
      <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 400, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ברוכים הבאים
        </div>
        <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>
          ז׳בוטינסקי 1, אזור
        </div>
      </div>
    </div>
  )
}
