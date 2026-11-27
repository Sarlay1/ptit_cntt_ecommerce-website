import { useState } from 'react'

export default function InteractiveImage({ src, alt, className = '', loading, onError }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return

    const horizontalPosition = (event.clientX - bounds.left) / bounds.width
    const verticalPosition = (event.clientY - bounds.top) / bounds.height

    setTilt({
      x: (0.5 - verticalPosition) * 10,
      y: (horizontalPosition - 0.5) * 12
    })
  }

  const resetTilt = () => setTilt({ x: 0, y: 0 })

  return (
    <div
      className={`interactive-image ${className}`.trim()}
      style={{ '--tilt-x': `${tilt.x}deg`, '--tilt-y': `${tilt.y}deg` }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <img src={src} alt={alt} loading={loading} onError={onError} draggable="false" />
    </div>
  )
}
