export function AdminCard({ title, children, compact }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '12px',
      padding: compact ? '0.85rem' : '1.25rem',
      boxShadow: '0 2px 12px rgba(30,35,48,0.07)',
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
    }}>
      {title && (
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e2330', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.6rem' }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3d4356' }}>{label}</span>
      <style>{`
        label input, label textarea, label select {
          padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.95rem;
          border: 1.5px solid #e5e7eb; outline: none; font-family: Rubik, sans-serif;
          direction: rtl; width: 100%; box-sizing: border-box; background: #fafafa;
          transition: border-color 0.15s;
        }
        label input:focus, label textarea:focus, label select:focus { border-color: #b8972a; background: #fff; }
        label textarea { resize: vertical; }
      `}</style>
      {children}
    </label>
  )
}

export function Btn({ children, onClick, primary, danger, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '0.5rem 1.1rem', borderRadius: '8px', fontSize: '0.9rem',
        fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none', fontFamily: 'Rubik, sans-serif',
        background: disabled ? '#e5e7eb' : primary ? '#1e2330' : danger ? '#fee2e2' : '#f4f6fa',
        color:      disabled ? '#9ca3af' : primary ? '#fff'     : danger ? '#c53030' : '#3d4356',
        opacity: disabled ? 0.7 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      {children}
    </button>
  )
}

export function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: '44px', height: '24px', borderRadius: '999px', border: 'none',
        background: value ? '#b8972a' : '#d1d5db', cursor: 'pointer',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: '3px',
        right: value ? '3px' : 'calc(100% - 21px)',
        width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
        transition: 'right 0.2s', display: 'block',
        boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
      }} />
    </button>
  )
}

export function EmptyState({ children }) {
  return (
    <div style={{
      textAlign: 'center', padding: '2.5rem', color: '#8890a4',
      background: '#fff', borderRadius: '12px', fontSize: '0.95rem',
    }}>
      {children}
    </div>
  )
}
