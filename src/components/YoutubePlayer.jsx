import { useState } from 'react'
import { useSettings } from '../hooks/useSettings'

export default function YoutubePlayer() {
  const settings = useSettings()
  const [minimized, setMinimized] = useState(false)

  const playlistId = settings['youtube_playlist_id']
  if (!playlistId) return null

  const src = `https://www.youtube.com/embed?listType=playlist&list=${playlistId}&autoplay=1&loop=1&controls=1&rel=0&modestbranding=1`

  return (
    <div style={{
      position: 'fixed',
      bottom: '4.5rem', // מעל הטיקר
      left: '1.5rem',
      zIndex: 40,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)',
      border: '2px solid var(--color-gold-muted)',
      background: '#000',
      transition: 'all 0.3s ease',
      width:  minimized ? '52px'  : '280px',
      height: minimized ? '52px'  : '158px',
    }}>
      {/* כפתור מזעור */}
      <button
        onClick={() => setMinimized(m => !m)}
        title={minimized ? 'הרחב נגן' : 'מזער נגן'}
        style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          zIndex: 10,
          background: 'rgba(0,0,0,0.6)',
          border: 'none',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          cursor: 'pointer',
          color: '#fff',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}
      >
        {minimized ? '♪' : '−'}
      </button>

      {!minimized && (
        <iframe
          src={src}
          width="280"
          height="158"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ display: 'block', border: 'none' }}
          title="מוזיקה"
        />
      )}
    </div>
  )
}
