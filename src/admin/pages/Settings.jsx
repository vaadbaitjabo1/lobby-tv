import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { AdminCard, Field, Btn } from '../AdminUI'

export default function Settings() {
  const [playlistId,   setPlaylistId]   = useState('')
  const [rotBusiness,  setRotBusiness]  = useState('10')
  const [rotFeatured,  setRotFeatured]  = useState('8')
  const [saved,        setSaved]        = useState(null)

  useEffect(() => {
    supabase.from('settings').select('key, value')
      .in('key', ['youtube_playlist_id', 'rotation_business', 'rotation_featured'])
      .then(({ data }) => {
        if (!data) return
        const map = Object.fromEntries(data.map(r => [r.key, r.value]))
        if (map.youtube_playlist_id) setPlaylistId(map.youtube_playlist_id)
        if (map.rotation_business)   setRotBusiness(map.rotation_business)
        if (map.rotation_featured)   setRotFeatured(map.rotation_featured)
      })
  }, [])

  async function savePlaylist() {
    await supabase.from('settings').upsert({ key: 'youtube_playlist_id', value: playlistId })
    flash('playlist')
  }

  async function saveRotations() {
    await supabase.from('settings').upsert([
      { key: 'rotation_business', value: String(parseInt(rotBusiness) || 10) },
      { key: 'rotation_featured', value: String(parseInt(rotFeatured) || 8)  },
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* תחלופה */}
      <AdminCard title="זמני תחלופה (שניות)">
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#8890a4' }}>
          כמה שניות כל פריט מוצג לפני שעובר לבא אחריו.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="עסקים ושירותים">
            <input
              type="number" min={3} max={120}
              value={rotBusiness}
              onChange={e => setRotBusiness(e.target.value)}
              onBlur={e => numInput(e.target.value, setRotBusiness)}
              style={{ direction: 'ltr', textAlign: 'center' }}
            />
          </Field>
          <Field label="ספורט / כלכלה / נולדו היום">
            <input
              type="number" min={3} max={120}
              value={rotFeatured}
              onChange={e => setRotFeatured(e.target.value)}
              onBlur={e => numInput(e.target.value, setRotFeatured)}
              style={{ direction: 'ltr', textAlign: 'center' }}
            />
          </Field>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <Btn onClick={saveRotations} primary>{saved === 'rotation' ? '✓ נשמר' : 'שמור'}</Btn>
        </div>
      </AdminCard>

      {/* פלייליסט YouTube */}
      <AdminCard title="מוזיקה — YouTube">
        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#8890a4' }}>
          הכנס את ה-ID של הפלייליסט מ-YouTube.<br />
          לדוגמה: מה-URL <code>youtube.com/playlist?list=<b>PLxxxxxxxx</b></code> — תעתיק רק את ה-ID.
        </p>
        <Field label="Playlist ID">
          <input
            value={playlistId}
            onChange={e => setPlaylistId(e.target.value)}
            placeholder="PLxxxxxxxxxxxxxxxx"
            style={{ direction: 'ltr', textAlign: 'left' }}
          />
        </Field>
        {playlistId && (
          <a
            href={`https://www.youtube.com/playlist?list=${playlistId}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: '0.85rem', color: '#b8972a' }}
          >
            פתח פלייליסט ב-YouTube ↗
          </a>
        )}
        <div style={{ marginTop: '1rem' }}>
          <Btn onClick={savePlaylist} primary>{saved === 'playlist' ? '✓ נשמר' : 'שמור'}</Btn>
        </div>
      </AdminCard>

      {/* קישור למסך */}
      <AdminCard title="קישור למסך הלובי">
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#8890a4' }}>
          שלח קישור זה לטלוויזיות בלובי:
        </p>
        <a
          href={`${window.location.origin}/lobby-tv/`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'block', padding: '0.6rem 0.9rem', background: '#f4f6fa',
            borderRadius: '8px', fontSize: '0.9rem', color: '#1e2330',
            direction: 'ltr', wordBreak: 'break-all',
          }}
        >
          {window.location.origin}/lobby-tv/
        </a>
      </AdminCard>
    </div>
  )
}
