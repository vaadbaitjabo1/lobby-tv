import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { AdminCard, Field, Btn } from '../AdminUI'

export default function Settings() {
  const [playlistId,        setPlaylistId]        = useState('')
  const [rotBusiness,       setRotBusiness]       = useState('10')
  const [rotFeatured,       setRotFeatured]       = useState('8')
  const [bizPromoTitle,     setBizPromoTitle]     = useState('')
  const [saved,             setSaved]             = useState(null)

  useEffect(() => {
    supabase.from('settings').select('key, value')
      .in('key', ['youtube_playlist_id', 'rotation_business', 'rotation_featured', 'business_promo_title'])
      .then(({ data }) => {
        if (!data) return
        const map = Object.fromEntries(data.map(r => [r.key, r.value]))
        if (map.youtube_playlist_id)  setPlaylistId(map.youtube_playlist_id)
        if (map.rotation_business)    setRotBusiness(map.rotation_business)
        if (map.rotation_featured)    setRotFeatured(map.rotation_featured)
        if (map.business_promo_title) setBizPromoTitle(map.business_promo_title)
      })
  }, [])

  async function savePlaylist() {
    await supabase.from('settings').upsert({ key: 'youtube_playlist_id', value: playlistId })
    flash('playlist')
  }

  async function saveBizTitle() {
    await supabase.from('settings').upsert({ key: 'business_promo_title', value: bizPromoTitle.trim() })
    flash('biztitle')
  }

  async function saveRotations() {
    const biz  = Math.min(120, Math.max(3, parseInt(rotBusiness) || 10))
    const feat = Math.min(120, Math.max(3, parseInt(rotFeatured) || 8))
    setRotBusiness(String(biz)); setRotFeatured(String(feat))
    await supabase.from('settings').upsert([
      { key: 'rotation_business', value: String(biz) },
      { key: 'rotation_featured', value: String(feat) },
    ])
    flash('rotation')
  }

  function flash(key) {
    setSaved(key)
    setTimeout(() => setSaved(null), 2000)
  }

  function numInput(val, set, min = 3, max = 120) {
    const n = parseInt(val)
    if (!isNaN(n)) set(String(Math.min(max, Math.max(min, n))))
    else set(val)
  }

  const lobbyUrl = window.location.origin + '/'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <AdminCard title="כותרת פאנל עסקים">
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#8890a4' }}>
          הטקסט שמוצג בראש פאנל העסקים בלובי. ניתן לכלול אמוג'י.
        </p>
        <Field label="כותרת">
          <input
            value={bizPromoTitle}
            onChange={e => setBizPromoTitle(e.target.value)}
            placeholder="נפרגן לעסקים של דיירי הבניין 👏🏼"
          />
        </Field>
        <div style={{ marginTop: '0.5rem' }}>
          <Btn onClick={saveBizTitle} primary>{saved === 'biztitle' ? '✓ נשמר' : 'שמור'}</Btn>
        </div>
      </AdminCard>

      <AdminCard title="זמני תחלופה (שניות)">
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#8890a4' }}>
          כמה שניות כל פריט מוצג לפני שעובר לבא אחריו.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="עסקים ושירותים">
            <input type="number" min={3} max={120} value={rotBusiness}
              onChange={e => setRotBusiness(e.target.value)}
              onBlur={e => numInput(e.target.value, setRotBusiness)}
              style={{ direction: 'ltr', textAlign: 'center' }} />
          </Field>
          <Field label="ספורט / כלכלה / נולדו היום">
            <input type="number" min={3} max={120} value={rotFeatured}
              onChange={e => setRotFeatured(e.target.value)}
              onBlur={e => numInput(e.target.value, setRotFeatured)}
              style={{ direction: 'ltr', textAlign: 'center' }} />
          </Field>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <Btn onClick={saveRotations} primary>{saved === 'rotation' ? '✓ נשמר' : 'שמור'}</Btn>
        </div>
      </AdminCard>

      <AdminCard title="מוזיקה — YouTube">
        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#8890a4' }}>
          הכנס את ה-ID של הפלייליסט מ-YouTube.<br />
          לדוגמה: מה-URL <code>youtube.com/playlist?list=<b>PLxxxxxxxx</b></code> — תעתיק רק את ה-ID.
        </p>
        <Field label="Playlist ID">
          <input value={playlistId} onChange={e => setPlaylistId(e.target.value)}
            placeholder="PLxxxxxxxxxxxxxxxx" style={{ direction: 'ltr', textAlign: 'left' }} />
        </Field>
        {playlistId && (
          <a href={`https://www.youtube.com/playlist?list=${playlistId}`} target="_blank" rel="noreferrer"
            style={{ fontSize: '0.85rem', color: '#b8972a' }}>
            פתח פלייליסט ב-YouTube ↗
          </a>
        )}
        <div style={{ marginTop: '1rem' }}>
          <Btn onClick={savePlaylist} primary>{saved === 'playlist' ? '✓ נשמר' : 'שמור'}</Btn>
        </div>
      </AdminCard>

      <AdminCard title="קישור למסך הלובי">
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#8890a4' }}>
          שלח קישור זה לטלוויזיות בלובי:
        </p>
        <a href={lobbyUrl} target="_blank" rel="noreferrer"
          style={{
            display: 'block', padding: '0.6rem 0.9rem', background: '#f4f6fa',
            borderRadius: '8px', fontSize: '0.9rem', color: '#1e2330',
            direction: 'ltr', wordBreak: 'break-all',
          }}>
          {lobbyUrl}
        </a>
      </AdminCard>
    </div>
  )
}
