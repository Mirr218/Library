'use client'

import { useState } from 'react'

interface EyeProtectionOverlayProps {
  isActive: boolean
}

export default function EyeProtectionOverlay({ isActive }: EyeProtectionOverlayProps) {
  const [intensity, setIntensity] = useState(0.3)

  if (!isActive) return null

  return (
    <div className="eye-protection-overlay">
      <div 
        className="overlay-layer"
        style={{ 
          opacity: intensity,
          backgroundColor: 'var(--overlay-color, rgba(173, 216, 230, 0.3))'
        }}
      />
      
      <div className="overlay-controls">
        <label>
          Интенсивность защиты:
          <input
            type="range"
            min="0.1"
            max="0.7"
            step="0.05"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
          />
          <span>{(intensity * 100).toFixed(0)}%</span>
        </label>
        
        <div className="color-presets">
          <button onClick={() => document.documentElement.style.setProperty('--overlay-color', 'rgba(173, 216, 230, 0.3)')}>
            Голубой
          </button>
          <button onClick={() => document.documentElement.style.setProperty('--overlay-color', 'rgba(255, 240, 220, 0.3)')}>
            Бежевый
          </button>
          <button onClick={() => document.documentElement.style.setProperty('--overlay-color', 'rgba(230, 255, 230, 0.3)')}>
            Зеленый
          </button>
        </div>
      </div>
    </div>
  )
}