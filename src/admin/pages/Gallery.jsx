import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { AdminCard, Field, Btn, Toggle, EmptyState } from '../AdminUI'

const empty = { url: '', type: 'image', caption: '', sort_order: 0, active: true }

export default function Gallery() {
  const [items, setItems]     = useState([])
  const [form, setForm]       = useState(empty)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving]   = useState(false)
  const [saveErr, setSaveErr] = useState('')
  const [uploading, setUploading] = useState(false)
  const [inputMode, setInputMode] = useState('url')
  const fileRef = useRef()

  async function load() {
    const { data } = await supabase.from('gallery').select('*').order('sort_order')
    if (data) setItems(data)
  }
  useEffect(() => { load() }, [])

  async function uploadFile(file) {
    setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('gallery').upload(path, file)
    if (error) { alert('שגיאה בהעלאה: ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from('gallery').getPublicUrl(path)
    setForm(f => ({ ...f, url: data.publicUrl, type: file.type.startsWith('video') ? 'video' : 'image' }))
    setUploading(false)
  }

  async function save() {
    setSaving(true); setSaveErr('')
    const payload = { ...form, sort_order: Number(form.sort_order) }
    const { error } = editing
      ? await supabase.from('gallery').update(payload).eq('id', editing)
      : await supabase.from('gallery').insert(payload)
    setSaving(false)
    if (error) { setSaveErr('שגיאה בשמירה: ' + error.message); return }
    setForm(empty); setEditing(null); load()
  }

  async function remove(id) {
    if (!confirm('למחוק פריט זה?')) return
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) { alert('שגיאה במחיקה: ' + error.message); return }
    load()
  }

  async function toggleActive(id, val) {
    await supabase.from('gallery').update({ active: val }).eq('id', id); load()
  }

  async function moveItem(itemId, direction) {
    const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order)
    const idx = sorted.findIndex(i => i.id === itemId)
    const newIdx = idx + direction
    if (newIdx < 0 || newIdx >= sorted.length) return
    const reordered = [...sorted]
    const [removed] = reordered.splice(idx, 1)
    reordered.splice(newIdx, 0, removed)
    await Promise.all(reordered.map((item, i) =>
      supabase.from('gallery').update({ sort_order: i * 10 }).eq('id', item.id)
    ))
    load()
  }

  function startEdit(item) {
    setEditing(item.id)
    setForm({ url: item.url, type: item.type, caption: item.caption ?? '', sort_order: item.sort_order, active: item.active })
    setInputMode('url')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <AdminCard title={editing ? 'עריכת פריט' : 'פריט חדש לגלריה'}>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
          {[['url', 'קישור URL'], ['upload', 'העלאת קובץ']].map(([mode, label]) => (
            <button key={mode} onClick={() => setInputMode(mode)} style={{
              padding: '0.35rem 0.9rem', borderRadius: '6px', border: 'none',
              fontFamily: 'Rubik, sans-serif', fontSize: '0.88rem', cursor: 'pointer',
              fontWeight: inputMode === mode ? 700 : 400,
              background: inputMode === mode ? '#1e2330' : '#f4f6fa',
              color: inputMode === mode ? '#fff' : '#8890a4',
            }}>
              {label}
            </button>
          ))}
        </div>

        {inputMode === 'url' ? (
          <Field label="URL">
            <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="https://..." style={{ direction: 'ltr', textAlign: 'left' }} />
          </Field>
        ) : (
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3d4356', display: 'block', marginBottom: '0.3rem' }}>בחר קובץ</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              style={{ display: 'none' }}
              onChange={e => { if (e.target.files[0]) uploadFile(e.target.files[0]); e.target.value = '' }}
            />
            <div
              style={{
                border: '2px dashed #d1d5db', borderRadius: '8px', padding: '1.25rem',
                textAlign: 'center', cursor: uploading ? 'wait' : 'pointer', background: '#fafafa',
              }}
              onClick={() => !uploading && fileRef.current?.click()}
            >
              {uploading ? (
                <span style={{ color: '#8890a4' }}>מעלה…</span>
              ) : form.url && inputMode === 'upload' ? (
                <span style={{ color: '#b8972a', fontSize: '0.9rem' }}>✓ הועלה בהצלחה — לחץ להחלפה</span>
              ) : (
                <span style={{ color: '#8890a4', fontSize: '0.9rem' }}>לחץ לבחירת תמונה או סרטון</span>
              )}
            </div>
          </div>
        )}

        {form.url && (
          form.type === 'image'
            ? <img src={form.url} alt="preview" style={{ maxHeight: '140px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e5e7eb' }} onError={e => e.target.style.display='none'} />
            : <div style={{ background: '#1e2330', borderRadius: '8px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem' }}>▶ סרטון</div>
        )}

        <Field label="כיתוב">
          <input value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
            placeholder="כיתוב (אופציונלי)" />
        </Field>
        <Field label="סדר תצוגה">
          <input type="number" value={form.sort_order}
            onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} />
        </Field>
        <Field label="פעיל">
          <Toggle value={form.active} onChange={v => setForm(f => ({ ...f, active: v }))} />
        </Field>

        {saveErr && <p style={{ margin: 0, color: '#c53030', fontSize: '0.85rem', background: '#fff5f5', borderRadius: '6px', padding: '0.4rem 0.7rem' }}>⚠️ {saveErr}</p>}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Btn onClick={save} disabled={!form.url || saving || uploading} primary>
            {saving ? 'שומר…' : editing ? 'עדכן' : 'הוסף'}
          </Btn>
          {editing && <Btn onClick={() => { setEditing(null); setForm(empty) }}>ביטול</Btn>}
        </div>
      </AdminCard>

      {items.length === 0 ? <EmptyState>הגלריה ריקה</EmptyState> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {items.map(item => (
            <AdminCard key={item.id} compact>
              {item.type === 'image'
                ? <img src={item.url} alt={item.caption ?? ''} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} onError={e => e.target.style.display='none'} />
                : <div style={{ width: '100%', height: '120px', background: '#1e2330', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem' }}>▶</div>
              }
              <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1e2330', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.caption || '(ללא כיתוב)'}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <Btn onClick={() => moveItem(item.id, -1)}>▲</Btn>
                  <Btn onClick={() => moveItem(item.id, +1)}>▼</Btn>
                  <Btn onClick={() => startEdit(item)}>עריכה</Btn>
                  <Btn onClick={() => remove(item.id)} danger>מחיקה</Btn>
                </div>
                <Toggle value={item.active} onChange={v => toggleActive(item.id, v)} />
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  )
}
