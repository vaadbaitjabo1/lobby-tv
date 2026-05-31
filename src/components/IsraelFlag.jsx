export default function IsraelFlag({ compact, stretch }) {
  return (
    <img
      src="/lobby-tv/flag2.gif"
      alt="דגל ישראל"
      style={{
        height: stretch ? '100%' : compact ? '3.5rem' : '100px',
        width: 'auto',
        filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.3))',
        flexShrink: 0,
        objectFit: 'contain',
        alignSelf: stretch ? 'stretch' : undefined,
      }}
    />
  )
}
