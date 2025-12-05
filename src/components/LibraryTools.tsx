'use client'

import { useState } from 'react'
import { useLocalLibrary, LocalBook } from '../app/hooks/useLocalLibrary'

export default function LibraryTools() {
  const { books, reload } = useLocalLibrary()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)
    
    try {
      const data = {
        books: books,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `library-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('Библиотека экспортирована!')
    } catch (error) {
      console.error('Export error:', error)
      alert('Ошибка при экспорте')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/json') {
      alert('Пожалуйста, выберите JSON файл')
      return
    }

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      if (!data.books || !Array.isArray(data.books)) {
        throw new Error('Неверный формат файла')
      }

      // Проверяем структуру книг
      const validBooks = data.books.filter((book: any) => 
        book.id && book.title && book.author && book.pdfUrl
      )

      if (validBooks.length === 0) {
        throw new Error('В файле нет валидных книг')
      }

      if (confirm(`Найдено ${validBooks.length} книг. Импортировать?`)) {
        localStorage.setItem('personal_library', JSON.stringify({
          books: validBooks,
          updatedAt: new Date().toISOString(),
          userId: localStorage.getItem('device_id') || 'unknown'
        }))
        
        reload()
        alert('Библиотека успешно импортирована!')
      }
    } catch (error: any) {
      console.error('Import error:', error)
      alert(`Ошибка импорта: ${error.message}`)
    } finally {
      e.target.value = ''
    }
  }

  return (
    <div className="library-tools">
      <button
        onClick={handleExport}
        disabled={isExporting || books.length === 0}
        className="btn btn-secondary"
      >
        {isExporting ? 'Экспорт...' : '📤 Экспорт библиотеки'}
      </button>
      
      <label className="btn btn-outline">
        📥 Импорт из файла
        <input
          type="file"
          accept=".json,application/json"
          onChange={handleImport}
          className="hidden-input"
        />
      </label>
    </div>
  )
}