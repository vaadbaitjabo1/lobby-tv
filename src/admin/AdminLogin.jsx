import { useState } from 'react'

const CORRECT = import.meta.env.VITE_ADMIN_PASSWORD

export default function AdminLogin({ onLogin }) {
  const [pw, setPw]     = useState('')
  const [err, setErr]   = useState(false)

  function submit(e) {
    e.preventDefault()
    if (pw === CORRECT) { onLogin(); setErr(false) }
    else { setErr(true); setPw('') }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f4f6fa', fontFamily: 'Rubik, sans-serif',
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '2.5rem 2rem',
        boxShadow: '0 8px 32px rgba(30,35,48,0.12)', width: '100%', maxWidth: '360px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1e2330' }}>
            פאנל ניהול
          </h1>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.9rem', color: '#8890a4' }}>
            ז׳בוטינסקי 1, אזור
          </p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            placeholder="סיסמה"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr(false) }}
            autoFocus
            style={{
              padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '1rem',
              border: `1.5px solid ${err ? '#e53e3e' : '#d1d5db'}`,
              outline: 'none', textAlign: 'right', fontFamily: 'inherit',
              direction: 'rtl',
            }}
          />
          {err && <p style={{ margin: 0, color: '#e53e3e', fontSize: '0.85rem', textAlign: 'center' }}>סיסמה שגויה</p>}
          <button type="submit" style={{
            padding: '0.75rem', borderRadius: '8px', fontSize: '1rem',
            fontWeight: 600, cursor: 'pointer', border: 'none',
            background: '#1e2330', color: '#fff', fontFamily: 'inherit',
          }}>
            כניסה
          </button>
        </form>
      </div>
    </div>
  )
}
