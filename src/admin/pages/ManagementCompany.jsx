import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { AdminCard, Field, Btn } from '../AdminUI'

export default function ManagementCompany() {
  const [title,  setTitle]  = useState('')
  const [text,   setText]   = useState('')
  const [qrUrl,  setQrUrl]  = useState('')
  const [saved,  setSaved]  = useState(false)

  useEffect(() => {
    supabase.from('settings').select('key, value')
      .in('key', ['mgmt_title', 'mgmt_text', 'mgmt_qr_url'])
      .then(({ data }) => {
        if (!data) return
        const map = Object.fromEntries(data.map(r => [r.key, r.value]))
        if (map.mgmt_title)  setTitle(map.mgmt_title)
        if (map.mgmt_text)   setText(map.mgmt_text)
        if (map.mgmt_qr_url) setQrUrl(map.mgmt_qr_url)
      })
  }, [])

  async function save() {
    await supabase.from('settings').upsert([
      { key: 'mgmt_title',  value: title  || 'חברת ניהול' },
      { key: 'mgmt_text',   value: text   || 'לפתיחת קריאה לחברת הניהול,\nנא לסרוק את ה-QR' },
      { key: 'mgmt_qr_url', value: qrUrl  },
    ])
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const qrPreview = qrUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=6&color=1a1a1a&bgcolor=ffffff&data=${encodeURIComponent(qrUrl)}`
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <AdminCard title="תיבת חברת הניהול">
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#8890a4' }}>
          הגדרות לתיבת QR שמוצגת בפינה השמאלית התחתונה של מסך הלובי.
        </p>

        <Field label="כותרת התיבה">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="חברת ניהול"
          />
        </Field>

        <Field label="טקסט הוראות (שורות מרובות — לחץ Enter)">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={'לפתיחת קריאה לחברת הניהול,\nנא לסרוק את ה-QR'}
            rows={3}
          />
        </Field>

        <Field label="כתובת URL עבור ה-QR">
          <input
            value={qrUrl}
            onChange={e => setQrUrl(e.target.value)}
            placeholder="https://wa.me/972..."
            style={{ direction: 'ltr', textAlign: 'left' }}
          />
        </Field>

        {qrPreview && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.25rem' }}>
            <img
              src={qrPreview}
              alt="תצוגה מקדימה"
              style={{ width: 100, height: 100, borderRadius: 8, border: '1px solid #e2e8f0' }}
            />
            <span style={{ fontSize: '0.85rem', color: '#8890a4' }}>תצוגה מקדימה של ה-QR</span>
          </div>
        )}

        <div style={{ marginTop: '0.25rem' }}>
          <Btn onClick={save} primary>{saved ? '✓ נשמר' : 'שמור'}</Btn>
        </div>
      </AdminCard>
    </div>
  )
}
