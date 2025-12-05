'use client'

import { SuggestedBook } from '@/types/book'
import { useSuggestedBooks } from '../app/hooks/useSuggestedBooks'
import { useState } from 'react'

interface SuggestedBookCardProps {
  book: SuggestedBook
  isAdded: boolean
}

export default function SuggestedBookCard({ book, isAdded }: SuggestedBookCardProps) {
  const { addToLibrary } = useSuggestedBooks()
  const [adding, setAdding] = useState(false)

  const handleAddToLibrary = async () => {
    setAdding(true)
    try {
      const success = await addToLibrary(book)
      if (success) {
        alert(`Книга "${book.title}" добавлена в вашу библиотеку!`)
        window.dispatchEvent(new Event('libraryUpdated'))
      }
    } catch (error) {
      console.error('Error adding book:', error)
      alert('Не удалось добавить книгу')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="suggested-book-card">
      <div className="suggested-book-content">
        <div className="suggested-book-header">
          <h4 className="suggested-book-title">{book.title}</h4>
          {book.difficulty_level && (
            <span className={`difficulty-badge ${book.difficulty_level.toLowerCase()}`}>
              {book.difficulty_level}
            </span>
          )}
        </div>
        
        <p className="suggested-book-author">👤 {book.author}</p>
        
        {book.description && (
          <p className="suggested-book-description">{book.description}</p>
        )}
        
        {book.category && (
          <div className="suggested-book-category">
            <span className="category-tag">🏷️ {book.category}</span>
          </div>
        )}
        
        {book.tags && book.tags.length > 0 && (
          <div className="suggested-book-tags">
            {book.tags.map(tag => (
              <span key={tag} className="suggested-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
      
      <div className="suggested-book-actions">
        {isAdded ? (
          <span className="added-badge">✅ В вашей библиотеке</span>
        ) : (
          <button
            onClick={handleAddToLibrary}
            disabled={adding}
            className="btn btn-primary"
          >
            {adding ? 'Добавление...' : '➕ Добавить в библиотеку'}
          </button>
        )}
        
        <a 
          href={book.pdf_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          👁️ Предварительный просмотр
        </a>
      </div>
    </div>
  )
}