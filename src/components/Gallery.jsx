import { useState, useEffect, useRef } from 'react'
import { useGallery } from '../hooks/useGallery'

function getYouTubeId(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
    if (u.hostname === 'youtu.be') return u.pathname.slice(1)
  } catch {}
  return null
}

function buildEmbedUrl(videoId) {
  const params = new URLSearchParams({
    autoplay: '1',
    loop: '1',
    playlist: videoId,   // required for loop to work
    mute: '1',
    controls: '0',
    rel: '0',
    modestbranding: '1',
    iv_load_policy: '3',
    disablekb: '1',
    playsinline: '1',
    fs: '0',
    vq: 'hd1080',
    hd: '1',
  })
  return `https://www.youtube.com/embed/${videoId}?${params}`
}

export default function Gallery() {
  const items = useGallery()
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const toRef = useRef(null)

  const currentItem = items[index]
  const isYouTube = currentItem ? !!getYouTubeId(currentItem.url) : false

  useEffect(() => {
    if (items.length < 2) return
    const duration = isYouTube ? 60000 : 7000
    const id = setInterval(() => {
      setVisible(false)
      toRef.current = setTimeout(() => {
        setIndex(i => (i + 1) % items.length)
        setVisible(true)
      }, 400)
    }, duration)
    return () => {
      clearInterval(id)
      if (toRef.current) { clearTimeout(toRef.current); toRef.current = null }
    }
  }, [items.length, isYouTube])

  if (!items.length) return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      color: '#1e40af',
    }}>
      <span style={{ fontSize: '4rem' }}>🖼️</span>
      <span style={{ fontSize: '1rem', fontWeight: 600 }}>גלריה</span>
      <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>הוסף תמונות דרך האדמין</span>
    </div>
  )

  const item    = items[index]
  const ytId    = getYouTubeId(item.url)
  const embedUrl = ytId ? buildEmbedUrl(ytId) : null

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000' }}>
      {embedUrl ? (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          <iframe
            key={index}
            src={embedUrl}
            title={item.title || 'YouTube'}
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              height: 'calc(100vh + 120px)',
              width: 'calc((100vh + 120px) * 16 / 9)',
              transform: 'translate(-50%, -50%)',
              border: 'none',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
        </div>
      ) : (
        <img
          key={index}
          src={item.url}
          alt={item.title || ''}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      )}
      {item.title && (
        <div style={{
          position: 'absolute', bottom: 0, right: 0, left: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
          color: '#fff',
          padding: '2rem 1rem 0.8rem',
          fontSize: '0.95rem', fontWeight: 600,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}>
          {item.title}
        </div>
      )}
    </div>
  )
}
