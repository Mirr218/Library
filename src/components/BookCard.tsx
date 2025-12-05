'use client'

import { useState } from 'react'
import { LocalBook } from '../app/hooks/useLocalLibrary'
import { useLocalLibrary } from '../app/hooks/useLocalLibrary'

interface BookCardProps {
  book: LocalBook
}

export default function BookCard({ book }: BookCardProps) {
  const { removeBook, deletingId } = useLocalLibrary()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsDeleting(true)
    
    try {
      await removeBook(book.id)
      // Книга автоматически удалится из состояния через хук
    } catch (error) {
      console.error('Ошибка при удалении:', error)
      alert('Не удалось удалить книгу')
      setIsDeleting(false)
    }
  }

  const isBeingDeleted = isDeleting || deletingId === book.id

  return (
    <div className={`book-card ${isBeingDeleted ? 'deleting' : ''}`}>
      <div className="book-content">
        <div className="book-header">
          <h3 className="book-title">{book.title}</h3>
          <button
            onClick={handleDelete}
            className="delete-btn"
            title="Удалить книгу из библиотеки"
            type="button"
            disabled={isBeingDeleted}
          >
            {isBeingDeleted ? '⌛' : '✕'}
          </button>
        </div>
        
        <p className="book-author">👤 {book.author}</p>
        
        {book.description && (
          <p className="book-description">{book.description}</p>
        )}
        
        <div className="book-meta">
          <span className="book-date">
            📅 Добавлено: {new Date(book.addedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="book-actions">
        <a
          href={`/book/${book.id}`}
          className="btn btn-secondary"
        >
          👁️ Читать
        </a>
        <a
          href={book.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          📥 Скачать
        </a>
      </div>
    </div>
  )
}