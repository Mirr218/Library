'use client'

import { useState, useEffect } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
//@ts-ignore
import './globals.css'
import ThemeToggle from '@/components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Моя библиотека',
//   description: 'Персональная библиотека технической литературы',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'eye-care'>('light')

  useEffect(() => {
    // Загружаем тему из localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'eye-care'
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'eye-care') => {
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <html lang="ru" data-theme={theme}>
      <body className={inter.className}>
        <div className="theme-controls">
          <ThemeToggle currentTheme={theme} onChange={handleThemeChange} />
        </div>
        {children}
      </body>
    </html>
  )
}