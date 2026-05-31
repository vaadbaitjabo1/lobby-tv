import { useState, useEffect } from 'react'
import { useFeaturedContent } from '../hooks/useFeaturedContent'
import { useSettings } from '../hooks/useSettings'

function ImageBox({ image, fallback }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => { setFailed(false) }, [image])

  return (
    <div style={{ width: '42%', flexShrink: 0, overflow: 'hidden', background: '#e5e7eb' }}>
      {image && !failed ? (
        <img
          src={image} alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
          onError={() => setFailed(true)}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '5rem' }}>{fallback}</span>
        </div>
      )}
    </div>
  )
}

const SOURCE_STYLES = {
  'ynet ספורט':  { bg: '#fbbf24', text: '#1e3a8a', label: '⚽🏀' },
  'ynet כלכלה':  { bg: '#15532e', text: '#fff',    label: '💰' },
  'נולדו היום':  { bg: '#4c1d95', text: '#fff',    label: '🎂' },
}

export default function FeaturedCard() {
  const items    = useFeaturedContent()
  const settings = useSettings()
  const [index, setIndex]     = useState(0)
  const [visible, setVisible] = useState(true)

  const DISPLAY_MS = (parseInt(settings.rotation_featured) || 8) * 1000

  useEffect(() => {
    if (items.length < 2) return
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % items.length)
        setVisible(true)
      }, 400)
    }, DISPLAY_MS)
    return () => clearInterval(id)
  }, [items.length, DISPLAY_MS])

  if (!items.length) return (
    <div style={{
      flex: 1,
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--color-muted)',
      fontSize: '0.9rem',
    }}>
      טוען תוכן…
    </div>
  )

  const item  = items[index]
  const style = SOURCE_STYLES[item.source] ?? { bg: '#374151', label: item.source }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.4s ease',
      overflow: 'hidden',
    }}>
      {/* פס מקור */}
      <div style={{
        background: style.bg,
        padding: '0.55rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ color: style.text ?? '#fff', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.04em' }}>
          {item.source}
        </span>
        <span style={{
          fontSize: '1.3rem',
          paddingRight: '0.6rem',
          borderRight: `1px solid ${style.text ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.3)'}`,
          lineHeight: 1,
        }}>
          {style.label}
        </span>
      </div>

      {/* ── layout אופקי: תמונה ימין, טקסט שמאל ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', direction: 'rtl' }}>
        {/* תמונה — ימין */}
        <ImageBox image={item.image} fallback={item.source === 'נולדו היום' ? '🎂' : '📰'} />
        {/* טקסט — שמאל */}
        <div style={{
          flex: 1, padding: '1rem 1.1rem',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: '0.6rem', overflow: 'hidden',
        }}>
          <div style={{
            fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)', lineHeight: 1.35,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {item.title}
          </div>
          {item.description && (
            <div style={{
              fontSize: '0.97rem', color: 'var(--color-charcoal)', lineHeight: 1.65,
              display: '-webkit-box', WebkitLineClamp: 7,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {item.description}
            </div>
          )}
        </div>
      </div>

      {/* פס התקדמות */}
      <div style={{ height: '4px', background: '#f0f0f0', flexShrink: 0 }}>
        <div key={`${index}-${item.source}`} style={{
          height: '100%',
          background: style.bg,
          animation: `progress-fill ${DISPLAY_MS}ms linear forwards`,
        }} />
      </div>

      <style>{`
        @keyframes progress-fill { from { width: 0% } to { width: 100% } }
      `}</style>
    </div>
  )
}
