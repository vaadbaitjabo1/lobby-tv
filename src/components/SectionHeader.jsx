export default function SectionHeader({ children }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: 'var(--color-primary)',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden',
      marginBottom: '0.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    }}>
      {/* פס זהב שמאלי */}
      <div style={{
        width: '4px',
        alignSelf: 'stretch',
        background: 'var(--color-accent-light)',
        flexShrink: 0,
      }} />
      <span style={{
        padding: '0.35rem 0.9rem',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#fff',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
    </div>
  )
}
