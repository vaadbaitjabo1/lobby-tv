import { useEffect, useRef, useState } from 'react'
import { useNewsTicker } from '../hooks/useNewsTicker'

const NBSP = ' '
const SEPARATOR = NBSP.repeat(14) + '◆' + NBSP.repeat(14)
const PX_PER_SEC = 80

export default function NewsTicker() {
  const headlines = useNewsTicker()
  const spanRef = useRef(null)
  const [duration, setDuration] = useState(0)

  const text = headlines.length
    ? headlines.join(SEPARATOR) + SEPARATOR
    : 'טוען חדשות…'

  useEffect(() => {
    if (!spanRef.current) return
    const id = requestAnimationFrame(() => {
      const w = spanRef.current?.scrollWidth ?? 0
      if (w > 0) setDuration((w + window.innerWidth) / PX_PER_SEC)
    })
    return () => cancelAnimationFrame(id)
  }, [text])

  return (
    <footer style={{
      height: '4.5rem',
      background: 'var(--color-primary)',
      borderTop: '2px solid rgba(255,255,255,0.15)',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <div style={{
        flexShrink: 0,
        background: 'var(--color-accent)',
        color: '#ffffff',
        fontWeight: 800,
        fontSize: '1.1rem',
        padding: '0 1.5rem',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        letterSpacing: '0.05em',
        zIndex: 1,
        boxShadow: '4px 0 12px rgba(0,0,0,0.3)',
      }}>
        חדשות
      </div>

      <div style={{ flex: 1, overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <span
          ref={spanRef}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            color: '#ffffff',
            fontSize: '1.3rem',
            fontWeight: 500,
            willChange: 'transform',
            position: 'absolute',
            left: 0,
            ...(duration > 0 && {
              animation: `news-ticker ${duration}s linear infinite`,
            }),
          }}
        >
          {text}
        </span>
      </div>

      <style>{`
        @keyframes news-ticker {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100vw); }
        }
      `}</style>
    </footer>
  )
}
