import { useState } from 'react'
import AdminLogin from './AdminLogin'
import Announcements from './pages/Announcements'
import Gallery from './pages/Gallery'
import Businesses from './pages/Businesses'
import Settings from './pages/Settings'

const TABS = [
  { id: 'announcements', label: 'הודעות',        icon: '📢' },
  { id: 'gallery',       label: 'גלריה',         icon: '🖼️' },
  { id: 'businesses',    label: 'עסקים ושירותים', icon: '🏪' },
  { id: 'settings',      label: 'הגדרות',        icon: '⚙️' },
]

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin') === '1')
  const [tab, setTab]       = useState('announcements')

  if (!authed) return <AdminLogin onLogin={() => { sessionStorage.setItem('admin', '1'); setAuthed(true) }} />

  const Page = { announcements: Announcements, gallery: Gallery, businesses: Businesses, settings: Settings }[tab]

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fa', fontFamily: 'Rubik, sans-serif', direction: 'rtl' }}>

      {/* Topbar */}
      <header style={{
        background: '#1e2330', color: '#fff', padding: '0 1.5rem',
        height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.01em' }}>
          פאנל ניהול — ז׳בוטינסקי 1
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a
            href="/lobby-tv/"
            target="_blank"
            style={{ color: '#b8972a', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}
          >
            צפה במסך ↗
          </a>
          <button
            onClick={() => { sessionStorage.removeItem('admin'); setAuthed(false) }}
            style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', borderRadius: '6px', padding: '0.3rem 0.75rem',
              cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit',
            }}
          >
            יציאה
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>

        {/* Sidebar — desktop */}
        <nav style={{
          width: '200px', background: '#fff', borderLeft: '1px solid #e5e7eb',
          padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem',
          position: 'sticky', top: '56px', height: 'calc(100vh - 56px)',
        }}
          className="admin-sidebar"
        >
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.65rem 1.25rem', border: 'none', background: 'transparent',
              cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'inherit',
              fontWeight: tab === t.id ? 700 : 400,
              color: tab === t.id ? '#1e2330' : '#8890a4',
              borderRight: tab === t.id ? '3px solid #b8972a' : '3px solid transparent',
              textAlign: 'right', width: '100%',
            }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main style={{ flex: 1, padding: '1.5rem', maxWidth: '760px' }}>
          <h1 style={{ margin: '0 0 1.25rem', fontSize: '1.25rem', fontWeight: 700, color: '#1e2330' }}>
            {TABS.find(t => t.id === tab)?.label}
          </h1>
          <Page />
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <nav style={{
        position: 'fixed', bottom: 0, right: 0, left: 0,
        background: '#1e2330', display: 'flex',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        zIndex: 100,
      }}
        className="admin-bottomnav"
      >
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '0.75rem 0', border: 'none', background: 'transparent',
            cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit',
            color: tab === t.id ? '#b8972a' : 'rgba(255,255,255,0.5)',
            fontWeight: tab === t.id ? 700 : 400,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
          }}>
            <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      <style>{`
        @media (min-width: 640px) {
          .admin-bottomnav { display: none !important; }
        }
        @media (max-width: 639px) {
          .admin-sidebar { display: none !important; }
          main { padding-bottom: 5rem !important; }
        }
      `}</style>
    </div>
  )
}
