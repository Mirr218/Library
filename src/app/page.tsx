'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import BookCatalog from '@/components/BookCatalog'
import LibraryTools from '@/components/LibraryTools'
import SuggestedBooksPanel from '@/components/SuggestedBooksPanel'
import { useLocalLibrary } from './hooks/useLocalLibrary'

export default function Home() {
  const { displayedBooks, isLoading, clearLibrary } = useLocalLibrary()

  // Автоматически перезагружаем библиотеку при изменении
  useEffect(() => {
    const handleLibraryUpdate = () => {
      window.location.reload()
    }

    window.addEventListener('libraryUpdated', handleLibraryUpdate)
    return () => window.removeEventListener('libraryUpdated', handleLibraryUpdate)
  }, [])

  if (isLoading) {
    return (
      <main className="container">
        <div className="loading">Загрузка вашей библиотеки...</div>
      </main>
    )
  }

  return (
    <main className="container">
      <div className="library-header">
        <h1 className="main-title">📚 Моя личная библиотека</h1>
        <p className="library-info">
          Книг в библиотеке: <strong>{displayedBooks.length}</strong>
        </p>
      </div>

      {/* Панель рекомендованных книг */}
      <SuggestedBooksPanel />

      <div className="actions">
        <Link href="/add-book" className="btn btn-primary">
          ➕ Добавить свою книгу
        </Link>
        <LibraryTools />
      </div>

      {displayedBooks.length === 0 ? (
        <div className="empty-library">
          <div className="empty-icon">📚</div>
          <h2>Библиотека пуста</h2>
          <p>Добавьте книги из рекомендуемых или загрузите свои</p>
          <p className="empty-note">
            ⚠️ Книги хранятся только в этом браузере. 
            Используйте экспорт для резервной копии.
          </p>
        </div>
      ) : (
        <>
          <BookCatalog books={displayedBooks} />
          <div className="library-footer">
            <button 
              onClick={() => {
                if (confirm('Вы уверены? Все книги будут удалены из этого браузера.')) {
                  clearLibrary()
                  window.dispatchEvent(new Event('libraryUpdated'))
                }
              }}
              className="btn btn-danger"
            >
              🗑️ Очистить библиотеку
            </button>
          </div>
        </>
      )}
    </main>
  )
}