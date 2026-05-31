import { useState, useEffect } from 'react'
import Gallery from './Gallery'

// בעתיד: דשבורד פיננסי, עסקים מומלצים
const SCREENS = ['gallery']
const SCREEN_MS = 30 * 1000

export default function RotatingContent() {
  const [screen] = useState('gallery')

  // TODO: הוסף מסכים נוספים כשיוגדרו בפאנל
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {screen === 'gallery' && <Gallery />}
    </div>
  )
}
