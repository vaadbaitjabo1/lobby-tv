import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { AdminCard, Field, Btn, Toggle, EmptyState } from '../AdminUI'

const BUCKET = 'business-images'
const EMPTY_FORM = { name: '', description: '', phone: '', active: true }

// המר כל תמונה ל-JPEG דחוס לפני העלאה — פותר HEIC ותמונות כבדות מאייפון
function compressToJpeg(file, maxWidth = 1400, quality = 0.88) {
  return new Promise(resolve => {
    const img = new Image()
    const blobUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(blobUrl)
      let { width, height } = img
      if (width > maxWidth) { height = Math.round(height * maxWidth / width); width = maxWidth }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => resolve(new File([blob], 'image.jpg', { type: 'image/jpeg' })), 'image/jpeg', quality)
    }
    img.onerror = () => { URL.revokeObjectURL(blobUrl); resolve(file) }
    img.src = blobUrl
  })
}

export default function Businesses() {
  const [items, setItems]     = useState([])
  const [form, setForm]       = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving]   = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [existingImageUrl, setExistingImageUrl] = useState(null)
  const fileRef = useRef()

  async function load() {
    const { data } = await supabase
      .from('businesses').select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true })
    if (data) setItems(data)
  }
  useEffect(() => { load() }, [])

  function pickImage(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function clearImage() {
    setImageFile(null)
    setImagePreview(null)
    setExistingImageUrl(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function uploadImage(id) {
    const compressed = await compressToJpeg(imageFile)
    const path = `${id}.jpg`
    const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
      upsert: true, contentType: 'image/jpeg',
    })
    if (error) throw new Error('העלאת תמונה נכשלה: ' + error.message)
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    // cache-bust כדי שהתמונה החדשה תוצג מיד
    return data.publicUrl + '?t=' + Date.now()
  }

  async function save() {
    if (!form.name.trim()) return
    setSaving(true)
    setUploadError(null)
    try {
      if (editing) {
        const update = { ...form }
        if (imageFile)                     update.image_url = await uploadImage(editing)
        else if (existingImageUrl === null) update.image_url = null
        await supabase.from('businesses').update(update).eq('id', editing)
      } else {
        const { data } = await supabase
          .from('businesses').insert({ ...form, image_url: null }).select().single()
        if (data && imageFile) {
          const url = await uploadImage(data.id)
          await supabase.from('businesses').update({ image_url: url }).eq('id', data.id)
        }
      }
      reset()
      load()
    } catch (e) {
      setUploadError(e.message)
    } finally {
      setSaving(false)
    }
  }

  function reset() {
    setForm(EMPTY_FORM)
    setEditing(null)
    setImageFile(null)
    setImagePreview(null)
    setExistingImageUrl(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function remove(item) {
    if (!confirm(`למחוק את "${item.name}"?`)) return
    if (item.image_url) {
      try {
        // חלץ את הנתיב בתוך ה-bucket מה-URL (הכל אחרי /business-images/)
        const url      = new URL(item.image_url)
        const segments = url.pathname.split(`/${BUCKET}/`)
        if (segments.length > 1) {
          const storagePath = segments[1].split('?')[0]
          await supabase.storage.from(BUCKET).remove([storagePath])
        }
      } catch { /* המשך למחיקת שורת DB גם אם מחיקת התמונה נכשלה */ }
    }
    const { error } = await supabase.from('businesses').delete().eq('id', item.id)
    if (error) { alert('שגיאה במחיקה: ' + error.message); return }
    load()
  }

  async function toggleActive(id, val) {
    await supabase.from('businesses').update({ active: val }).eq('id', id)
    load()
  }

  function startEdit(item) {
    setEditing(item.id)
    setForm({ name: item.name, description: item.description ?? '', phone: item.phone ?? '', active: item.active })
    setImageFile(null)
    setImagePreview(item.image_url ?? null)
    setExistingImageUrl(item.image_url ?? null)
    if (fileRef.current) fileRef.current.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <AdminCard title={editing ? 'עריכת עסק / שירות' : 'עסק / שירות חדש'}>
        <Field label="שם נותן השירות">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="לדוגמה: אינסטלטור אבי כהן" />
        </Field>
        <Field label="תיאור השירות">
          <textarea rows={2} value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="תיאור קצר של השירות..." />
        </Field>
        <Field label="מספר טלפון">
          <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="050-0000000" style={{ direction: 'ltr', textAlign: 'right' }} />
        </Field>

        <Field label="תמונה / גרפיקה">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              cursor: 'pointer', padding: '0.5rem 1rem',
              background: '#f4f6fa', border: '1.5px dashed #d1d5db',
              borderRadius: '8px', fontSize: '0.9rem', color: '#3d4356',
              width: 'fit-content',
            }}>
              📁 בחר תמונה
              <input ref={fileRef} type="file" accept="image/*" onChange={pickImage} style={{ display: 'none' }} />
            </label>
            {imagePreview && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <img src={imagePreview} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <button onClick={clearImage} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c53030', fontSize: '1.1rem', lineHeight: 1 }} title="הסר תמונה">✕</button>
              </div>
            )}
          </div>
        </Field>

        <Field label="מוצג בלובי">
          <Toggle value={form.active} onChange={v => setForm(f => ({ ...f, active: v }))} />
        </Field>

        {uploadError && (
          <div style={{ color: '#c53030', fontSize: '0.85rem', background: '#fff5f5', borderRadius: '6px', padding: '0.5rem 0.75rem' }}>
            ⚠️ {uploadError}
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Btn onClick={save} disabled={!form.name.trim() || saving} primary>
            {saving ? 'שומר…' : editing ? 'עדכן' : 'הוסף'}
          </Btn>
          {editing && <Btn onClick={reset}>ביטול</Btn>}
        </div>
      </AdminCard>

      {items.length === 0 ? (
        <EmptyState>אין עסקים / שירותים עדיין</EmptyState>
      ) : items.map(item => (
        <AdminCard key={item.id}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            {item.image_url ? (
              <img src={item.image_url} alt="" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0, border: '1px solid #e5e7eb' }} />
            ) : (
              <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.8rem' }}>🏢</div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e2330' }}>{item.name}</div>
              {item.description && <div style={{ fontSize: '0.85rem', color: '#8890a4', marginTop: '0.15rem' }}>{item.description}</div>}
              {item.phone && <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3d4356', marginTop: '0.15rem', direction: 'ltr', textAlign: 'right' }}>{item.phone}</div>}
            </div>
            <Toggle value={item.active} onChange={v => toggleActive(item.id, v)} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <Btn onClick={() => startEdit(item)}>עריכה</Btn>
            <Btn onClick={() => remove(item)} danger>מחיקה</Btn>
          </div>
        </AdminCard>
      ))}
    </div>
  )
}
