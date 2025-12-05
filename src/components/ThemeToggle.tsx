'use client'

interface ThemeToggleProps {
  currentTheme: 'light' | 'dark' | 'eye-care'
  onChange: (theme: 'light' | 'dark' | 'eye-care') => void
}

export default function ThemeToggle({ currentTheme, onChange }: ThemeToggleProps) {
  return (
    <div className="theme-toggle">
      <button
        onClick={() => onChange('light')}
        className={`theme-btn ${currentTheme === 'light' ? 'active' : ''}`}
        title="Светлая тема"
      >
        ☀️
      </button>
      <button
        onClick={() => onChange('dark')}
        className={`theme-btn ${currentTheme === 'dark' ? 'active' : ''}`}
        title="Темная тема"
      >
        🌙
      </button>
      <button
        onClick={() => onChange('eye-care')}
        className={`theme-btn`}
        title="Режим защиты глаз"
      >
        👁️
      </button>
    </div>
  )
}