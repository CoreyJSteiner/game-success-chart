import { useState, useEffect } from 'react'
import { wait } from '../utils'

const InitialLoadFader = triggerFade => {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const fadeIn = async () => {
      await wait(1000)
      const fadeIn = setInterval(() => {
        setOpacity(prev => (prev > 0 ? prev - 0.01 : 0))
      }, 16)
      return () => clearInterval(fadeIn)
    }

    if (triggerFade) {
      fadeIn()
    }
  }, [triggerFade])

  return (
    <div
      style={{
        opacity,
        position: 'fixed',
        transition: 'opacity 0.1s',
        zIndex: '9998',
        backgroundColor: '#1e1e3a',
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    ></div>
  )
}

export default InitialLoadFader
