import { useRef, useState } from 'react'

const LOBBY_URL = window.location.origin + '/'

export default function Preview() {
  const iframeRef = useRef(null)
  const [scale, setScale] = useState('desktop')

  const dims = {
    desktop: { w: '100%',  h: '540px', label: '🖥 מחשב / טלוויזיה' },
    mobile:  { w: '390px', h: '844px', label: '📱 טלפון' },
  }
  const d = dims[scale]

  function reload() {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Controls */}
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '1rem 1.25rem',
        boxShadow: '0 2px 12px rgba(30,35,48,0.07)',
        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {Object.entries(dims).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setScale(key)}
              style={{
                padding: '0.4rem 0.9rem', borderRadius: '8px', border: 'none',
                cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit',
                background: scale === key ? '#1e2330' : '#f4f6fa',
                color:      scale === key ? '#fff'     : '#3d4356',
                fontWeight: scale === key ? 700        : 400,
              }}
            >
              {val.label}
            </button>
          ))}
        </div>

        <button
          onClick={reload}
          style={{
            padding: '0.4rem 0.9rem', borderRadius: '8px', border: '1.5px solid #e5e7eb',
            cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit',
            background: '#fff', color: '#3d4356',
          }}
        >
          ↺ רענן תצוגה מקדימה
        </button>

        <a
          href={LOBBY_URL}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: '0.85rem', color: '#b8972a', marginRight: 'auto' }}
        >
          פתח בחלון מלא ↗
        </a>

        <div style={{ fontSize: '0.8rem', color: '#8890a4' }}>
          שינויים בנתונים מופיעים מיד • שינויי עיצוב מופיעים לאחר עדכון
        </div>
      </div>

      {/* iframe container */}
      <div style={{
        background: '#e5e7eb',
        borderRadius: '12px',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '560px',
        overflow: 'auto',
      }}>
        <div style={{
          width: d.w,
          height: d.h,
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
          flexShrink: 0,
        }}>
          <iframe
            ref={iframeRef}
            src={LOBBY_URL}
            title="תצוגה מקדימה של מסך הלובי"
            style={{
              width: scale === 'desktop' ? '100%' : '390px',
              height: d.h,
              border: 'none',
              display: 'block',
            }}
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  )
}
