import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { AdminCard, Field, Btn, Toggle, EmptyState } from '../AdminUI'

export default function Announcements() {
  const [items, setItems]   = useState([])
  const [form, setForm]     = useState({ title: '', body: '', active: true })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    if (data) setItems(data)
  }
  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    if (editing) {
      await supabase.from('announcements').update(form).eq('id', editing)
    } else {
      await supabase.from('announcements').insert(form)
    }
    setForm({ title: '', body: '', active: true })
    setEditing(null)
    setSaving(false)
    load()
  }

  async function remove(id) {
    if (!confirm('למחוק הודעה זו?')) return
    await supabase.from('announcements').delete().eq('id', id)
    load()
  }

  async function toggleActive(id, val) {
    await supabase.from('announcements').update({ active: val }).eq('id', id)
    load()
  }

  function startEdit(item) {
    setEditing(item.id)
    setForm({ title: item.title, body: item.body ?? '', active: item.active })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* טופס */}
      <AdminCard title={editing ? 'עריכת הודעה' : 'הודעה חדשה'}>
        <Field label="כותרת">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="כותרת ההודעה" />
        </Field>
        <Field label="תוכן (אופציונלי)">
          <textarea rows={3} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            placeholder="פרטים נוספים..." />
        </Field>
        <Field label="פעיל">
          <Toggle value={form.active} onChange={v => setForm(f => ({ ...f, active: v }))} />
        </Field>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Btn onClick={save} disabled={!form.title || saving} primary>
            {saving ? 'שומר…' : editing ? 'עדכן' : 'פרסם'}
          </Btn>
          {editing && <Btn onClick={() => { setEditing(null); setForm({ title: '', body: '', active: true }) }}>ביטול</Btn>}
        </div>
      </AdminCard>

      {/* רשימה */}
      {items.length === 0 ? <EmptyState>אין הודעות עדיין</EmptyState> : items.map(item => (
        <AdminCard key={item.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1e2330' }}>{item.title}</div>
              {item.body && <div style={{ fontSize: '0.85rem', color: '#8890a4', marginTop: '0.2rem' }}>{item.body}</div>}
            </div>
            <Toggle value={item.active} onChange={v => toggleActive(item.id, v)} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <Btn onClick={() => startEdit(item)}>עריכה</Btn>
            <Btn onClick={() => remove(item.id)} danger>מחיקה</Btn>
          </div>
        </AdminCard>
      ))}
    </div>
  )
}
