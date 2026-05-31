import { useState, useEffect, useRef } from 'react'
import { useFeaturedContent } from '../hooks/useFeaturedContent'
import { useSettings } from '../contexts/SettingsContext'

// ─── Image box with fallback ──────────────────────────────────────────────────
function ImageBox({ image, fallback }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => { setFailed(false) }, [image])

  return (
    <div style={{
      width: '42%', flexShrink: 0,
      overflow: 'hidden', background: '#e5e7eb',
      position: 'relative',
    }}>
      {image && !failed ? (
        <img
          src={image}
          alt=""
          referrerPolicy="no-referrer"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top center',
            display: 'block',
          }}
          onError={() => setFailed(true)}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '5rem' }}>{fallback}</span>
        </div>
      )}
    </div>
  )
}

// ─── Source label styles ──────────────────────────────────────────────────────
const SOURCE_STYLES = {
  'ynet ספורט': { bg: '#fbbf24', text: '#1e3a8a', label: '⚽🏀' },
  'ynet כלכלה': { bg: '#15532e', text: '#fff',    label: '💰'  },
  'נולדו היום': { bg: '#4c1d95', text: '#fff',    label: '🎂'  },
}

// ─── Transition phases — original timing/distances, no blur (TV-safe)
const PHASE_STYLE = {
  show: {
    opacity:    1,
    transform:  'translate3d(0, 0, 0) scale(1)',
    transition: 'opacity 0.62s ease, transform 0.62s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  exit: {
    opacity:    0,
    transform:  'translate3d(0, -20px, 0) scale(0.976)',
    transition: 'opacity 0.32s ease-in, transform 0.32s ease-in',
  },
  enter: {
    opacity:    0,
    transform:  'translate3d(0, 28px, 0) scale(0.976)',
    transition: 'none',
  },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FeaturedCard() {
  const items    = useFeaturedContent()
  const settings = useSettings()

  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('show')
  const t1 = useRef(null)
  const t2 = useRef(null)

  const DISPLAY_MS = (parseInt(settings.rotation_featured) || 8) * 1000

  function clearTimers() {
    if (t1.current) { clearTimeout(t1.current); t1.current = null }
    if (t2.current) { clearTimeout(t2.current); t2.current = null }
  }

  useEffect(() => {
    setPhase('show')
    if (items.length < 2) return

    const id = setInterval(() => {
      // 1. Exit: slide up + fade out
      setPhase('exit')

      // 2. After exit animation (320ms): swap content, position below (no transition)
      t1.current = setTimeout(() => {
        setIndex(i => (i + 1) % items.length)
        setPhase('enter')

        // 3. Two frames later: animate into place — extra delay for TV browsers
        t2.current = setTimeout(() => setPhase('show'), 80)
      }, 340)
    }, DISPLAY_MS)

    return () => { clearInterval(id); clearTimers() }
  }, [items.length, DISPLAY_MS])

  // ── Loading state ──
  if (!items.length) return (
    <div style={{
      flex: 1, background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--color-muted)', fontSize: '0.9rem',
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
      overflow: 'hidden',
      willChange: 'opacity, transform',
      ...PHASE_STYLE[phase],
    }}>

      {/* ── Source label bar ── */}
      <div style={{
        background: style.bg,
        padding: '0.55rem 1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{
          color: style.text ?? '#fff',
          fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.04em',
        }}>
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

      {/* ── Body: image (right) + text (left), RTL ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', direction: 'rtl' }}>

        {/* Image */}
        <ImageBox
          image={item.image}
          fallback={item.source === 'נולדו היום' ? '🎂' : '📰'}
        />

        {/* Text */}
        <div style={{
          flex: 1, padding: '0.95rem 1.1rem',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: '0.55rem', overflow: 'hidden',
        }}>

          {/* Title + birth year */}
          <div>
            <div style={{
              fontWeight: 800, fontSize: '1.25rem',
              color: 'var(--color-primary)', lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {item.title}
            </div>
            {item.birthYear && (
              <div style={{
                fontSize: '0.82rem', color: '#9ca3af',
                fontWeight: 500, marginTop: '0.22rem', letterSpacing: '0.03em',
              }}>
                יליד/ה {item.birthYear}
              </div>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <div style={{
              fontSize: '1rem', color: 'var(--color-charcoal)',
              lineHeight: 1.7,
              display: '-webkit-box',
              WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {item.description}
            </div>
          )}

        </div>
      </div>

      {/* ── Progress bar (GPU scaleX) ── */}
      <div style={{ height: '4px', background: '#f0f0f0', flexShrink: 0, overflow: 'hidden' }}>
        <div
          key={`${index}-${item.source}`}
          style={{
            height: '100%', width: '100%',
            background: style.bg,
            transformOrigin: '0% 50%',
            animation: `progress-fill ${DISPLAY_MS}ms linear forwards`,
            willChange: 'transform',
          }}
        />
      </div>

    </div>
  )
}
