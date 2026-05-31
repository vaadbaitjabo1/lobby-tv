import { useState, useEffect } from 'react'
import { useBusinesses } from '../hooks/useBusinesses'
import { useSettings } from '../hooks/useSettings'

export default function BusinessPromo() {
  const businesses = useBusinesses()
  const settings   = useSettings()
  const [index, setIndex]     = useState(0)
  const [visible, setVisible] = useState(true)

  const intervalMs = (parseInt(settings.rotation_business) || 10) * 1000

  useEffect(() => {
    if (businesses.length < 2) return
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % businesses.length)
        setVisible(true)
      }, 400)
    }, intervalMs)
    return () => clearInterval(id)
  }, [businesses.length, intervalMs])

  const biz = businesses[index]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', height: '100%', overflow: 'hidden' }}>
      {/* כותרת */}
      <div style={{
        background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
        padding: '0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>עסקים ושירותים</span>
        <span style={{ fontSize: '1.1rem' }}>🏪</span>
      </div>

      {/* תוכן */}
      {businesses.length === 0 ? (
        <div style={{
          flex: 1, background: '#ecfdf5',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '0.5rem', padding: '1rem',
        }}>
          <span style={{ fontSize: '2.2rem' }}>🏢</span>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#065f46', textAlign: 'center' }}>
            קידום עסקים מקומיים
          </div>
          <div style={{ fontSize: '0.8rem', color: '#8890a4', textAlign: 'center' }}>
            פרסום עסקי לדיירי הבניין — בקרוב
          </div>
        </div>
      ) : (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
        }}>
          {/* טקסט — חצי עליון */}
          <div style={{
            flex: '0 0 50%', overflow: 'hidden', padding: '0.9rem 1rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            gap: '0.4rem', direction: 'rtl',
            borderBottom: '1px solid #e5e7eb',
          }}>
            <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#0891b2', lineHeight: 1.25 }}>
              {biz.name}
            </div>
            {biz.description && (
              <div style={{
                fontSize: '1.1rem', color: '#374151', lineHeight: 1.55,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {biz.description}
              </div>
            )}
            {biz.phone && (
              <div style={{ fontWeight: 700, fontSize: '1.3rem', color: '#1e2330', direction: 'ltr', textAlign: 'right' }}>
                {biz.phone}
              </div>
            )}
          </div>

          {/* תמונה — חצי תחתון */}
          <div style={{ flex: '0 0 50%', overflow: 'hidden', background: '#ecfdf5', position: 'relative' }}>
            {biz.image_url ? (
              <img
                src={biz.image_url}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={e => { e.target.style.display = 'none' }}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '5rem' }}>🏢</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* פס התקדמות */}
      {businesses.length > 0 && (
        <div style={{ height: '3px', background: '#e0f2fe', flexShrink: 0 }}>
          <div key={index} style={{
            height: '100%', background: '#0891b2',
            animation: `biz-progress ${intervalMs}ms linear forwards`,
          }} />
        </div>
      )}

      <style>{`@keyframes biz-progress { from { width:0% } to { width:100% } }`}</style>
    </div>
  )
}
