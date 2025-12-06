'use client'

import { useState, useEffect } from 'react'
import { Inter } from 'next/font/google'
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
  const [theme, setTheme] = useState<'light' | 'dark' | 'eye-care'>(() => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'eye-care';
    return savedTheme || 'light';
  }
  return 'light';
});

useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);

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