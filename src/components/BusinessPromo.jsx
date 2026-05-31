import { useState, useEffect, useRef } from 'react'
import { useBusinesses } from '../hooks/useBusinesses'
import { useSettings } from '../contexts/SettingsContext'

export default function BusinessPromo() {
  const businesses = useBusinesses()
  const settings   = useSettings()
  const [index, setIndex]     = useState(0)
  const [visible, setVisible] = useState(true)
  const toRef = useRef(null)

  const intervalMs = (parseInt(settings.rotation_business) || 10) * 1000

  useEffect(() => {
    if (businesses.length < 2) return
    const id = setInterval(() => {
      setVisible(false)
      toRef.current = setTimeout(() => {
        setIndex(i => (i + 1) % businesses.length)
        setVisible(true)
      }, 400)
    }, intervalMs)
    return () => {
      clearInterval(id)
      if (toRef.current) { clearTimeout(toRef.current); toRef.current = null }
    }
  }, [businesses.length, intervalMs])

  const biz = businesses[index]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', height: '100%', overflow: 'hidden' }}>

      {/* כותרת */}
      <div style={{
        background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
        padding: '0.5rem 1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>
          {settings.business_promo_title || 'נפרגן לעסקים של דיירי הבניין 👏🏼'}
        </span>
        <span style={{ fontSize: '1.1rem' }}>🏪</span>
      </div>

      {/* תוכן — ריק */}
      {businesses.length === 0 && (
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
      )}

      {/* תוכן — עסק פעיל: 1/3 טקסט + 2/3 תמונה */}
      {businesses.length > 0 && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
        }}>

          {/* טקסט — שליש עליון */}
          <div style={{
            flex: '0 0 33%', overflow: 'hidden',
            padding: '0.7rem 1rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            gap: '0.3rem', direction: 'rtl',
            borderBottom: '1px solid #e5e7eb',
          }}>
            <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#0891b2', lineHeight: 1.25 }}>
              {biz.name}
            </div>
            {biz.description && (
              <div style={{
                fontSize: '0.95rem', color: '#374151', lineHeight: 1.5,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {biz.description}
              </div>
            )}
            {biz.phone && (
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e2330', direction: 'ltr', textAlign: 'right' }}>
                {biz.phone}
              </div>
            )}
          </div>

          {/* תמונה — שני שלישים תחתונים, contain = תמונה מלאה ללא חיתוך */}
          <div style={{ flex: '0 0 67%', overflow: 'hidden', background: '#f1f5f9', position: 'relative' }}>
            {biz.image_url ? (
              <img
                src={biz.image_url}
                alt=""
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'contain', display: 'block',
                }}
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
        <div style={{ height: '3px', background: '#e0f2fe', flexShrink: 0, overflow: 'hidden' }}>
          <div key={index} style={{
            height: '100%', width: '100%', background: '#0891b2',
            transformOrigin: '0% 50%',
            animation: `biz-progress ${intervalMs}ms linear forwards`,
            willChange: 'transform',
          }} />
        </div>
      )}

    </div>
  )
}
