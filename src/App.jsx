import ClockDate from './components/ClockDate'
import Weather from './components/Weather'
import NewsTicker from './components/NewsTicker'
import IsraelFlag from './components/IsraelFlag'
import Gallery from './components/Gallery'
import Announcements from './components/Announcements'
import FeaturedCard from './components/FeaturedCard'
import ShabbatPanel from './components/ShabbatPanel'
import BusinessPromo from './components/BusinessPromo'
import QRBox from './components/QRBox'
import { useShabbat } from './hooks/useShabbat'

const CELL = {
  borderRadius: '0.8rem',
  overflow: 'hidden',
  border: '1px solid rgba(13,45,107,0.1)',
  boxShadow: '0 2px 8px rgba(13,45,107,0.07)',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
}

export default function App() {
  const { show } = useShabbat()
  const previewMode = new URLSearchParams(window.location.search).has('preview')

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'grid',
      gridTemplateRows: '1fr auto',
      overflow: 'hidden',
      fontFamily: 'var(--font-body)',
      background: 'var(--color-bg)',
    }}>

      {/* ── לוח ראשי ── */}
      <div style={{
        margin: '0.8rem',
        marginBottom: 0,
        borderRadius: '1rem',
        border: '2px solid rgba(13,45,107,0.15)',
        boxShadow: '0 6px 28px rgba(0,0,0,0.16)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg)',
        minHeight: 0,
      }}>

        {/* ── כותרת ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.2rem',
          padding: '1.3rem 1.8rem',
          borderBottom: '1px solid rgba(13,45,107,0.1)',
          flexShrink: 0,
          background: 'var(--color-primary)',
        }}>
          <IsraelFlag compact />
          <div style={{ lineHeight: 1.25 }}>
            <div style={{
              fontSize: '1rem', fontWeight: 500,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              marginBottom: '0.2rem',
            }}>
              ברוכים הבאים
            </div>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>
              ז׳בוטינסקי 1, אזור
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <ClockDate dark compact />
          <div style={{ width: '1px', height: '3.5rem', background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
          <Weather dark compact />
        </div>

        {/* ── 3 עמודות ── */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.9fr 0.75fr',
          gap: '0.65rem',
          padding: '0.65rem',
          overflow: 'hidden',
          minHeight: 0,
        }}>

          {/* ימין — גלריה */}
          <div style={CELL}>
            <Gallery />
          </div>

          {/* אמצע — הודעות + פיד */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', minHeight: 0 }}>
            <div style={{ ...CELL, flexShrink: 0 }}>
              <Announcements />
            </div>
            <div style={{ ...CELL, flex: 1 }}>
              <FeaturedCard />
            </div>
          </div>

          {/* שמאל — שבת/עסקים + QR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', minHeight: 0 }}>
            <div style={{ ...CELL, flex: 1 }}>
              {show && !previewMode ? <ShabbatPanel /> : <BusinessPromo />}
            </div>
            <div style={{ ...CELL, flexShrink: 0 }}>
              <QRBox />
            </div>
          </div>

        </div>
      </div>

      {/* ── פס חדשות ── */}
      <NewsTicker />
    </div>
  )
}
