import { useState, useEffect, useRef } from 'react'
import { useNewsTicker } from '../hooks/useNewsTicker'

// Non-breaking spaces so the browser never collapses them
const NBSP      = ' '
const SEPARATOR = NBSP.repeat(10) + '◆' + NBSP.repeat(10)
const PX_PER_SEC = 90

// CSS keyframe animation — runs on compositor thread, reliable on TV browsers
const TICKER_KEYFRAMES = `
  @keyframes ticker-scroll {
    from { transform: translateX(-50%); }
    to   { transform: translateX(0%);   }
  }
`

export default function NewsTicker() {
  const headlines   = useNewsTicker()
  const spanRef     = useRef(null)
  const [duration, setDuration] = useState(null)
  const retryRef    = useRef(null)

  // Items are HTML strings (market items have color spans; headlines are escaped text)
  const singleHtml = headlines.length
    ? headlines.join(SEPARATOR) + SEPARATOR
    : 'טוען חדשות…' + SEPARATOR

  // Double the HTML so the loop is seamless — no blank gap between repetitions
  const loopHtml = singleHtml + singleHtml

  useEffect(() => {
    const span = spanRef.current
    if (!span) return

    setDuration(null)
    if (retryRef.current) { clearTimeout(retryRef.current); retryRef.current = null }

    function measure() {
      const w = span.scrollWidth / 2
      if (w > 0) {
        setDuration(w / PX_PER_SEC)
      } else {
        // TV browsers may need extra time for layout — retry up to a few times
        retryRef.current = setTimeout(measure, 250)
      }
    }

    // One rAF to let the browser render, then measure
    const rafId = requestAnimationFrame(measure)

    function onResize() {
      const w = spanRef.current?.scrollWidth / 2
      if (w > 0) setDuration(w / PX_PER_SEC)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      if (retryRef.current) clearTimeout(retryRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [loopHtml])

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
      <style>{TICKER_KEYFRAMES}</style>

      {/* Label */}
      <div style={{
        flexShrink: 0,
        background: 'var(--color-accent)',
        color: '#ffffff',
        fontWeight: 900,
        fontSize: '1.4rem',
        padding: '0 1.8rem',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        letterSpacing: '0.05em',
        zIndex: 1,
        boxShadow: '4px 0 12px rgba(0,0,0,0.3)',
      }}>
        חדשות
      </div>

      {/* Scrolling text */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}>
        <span
          ref={spanRef}
          dangerouslySetInnerHTML={{ __html: loopHtml }}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            color: '#ffffff',
            fontSize: '1.55rem',
            fontWeight: 500,
            willChange: 'transform',
            position: 'absolute',
            left: 0,
            // Show only once duration is measured; CSS animation handles all movement
            visibility: duration ? 'visible' : 'hidden',
            animation: duration ? `ticker-scroll ${duration}s linear infinite` : 'none',
          }}
        />
      </div>
    </footer>
  )
}
