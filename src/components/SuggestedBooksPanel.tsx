'use client'

import { useState } from 'react'
import { useSuggestedBooks } from '../app/hooks/useSuggestedBooks'
import { useLocalLibrary } from '../app/hooks/useLocalLibrary'
import SuggestedBookCard from './SuggestedBookCard'

export default function SuggestedBooksPanel() {
  const { suggestedBooks, loading, error, addAllToLibrary, isBookAdded } = useSuggestedBooks()
  const { showSuggested, toggleShowSuggested } = useLocalLibrary()
  const [expanded, setExpanded] = useState(false)

  if (loading) {
    return (
      <div className="suggested-panel">
        <div className="loading">Загрузка рекомендуемых книг...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="suggested-panel">
        <div className="error-message">Не удалось загрузить рекомендуемые книги</div>
      </div>
    )
  }

  if (suggestedBooks.length === 0) {
    return null
  }

  const handleAddAll = async () => {
    const addedCount = await addAllToLibrary()
    if (addedCount > 0) {
      alert(`Добавлено ${addedCount} книг в вашу библиотеку!`)
      window.dispatchEvent(new Event('libraryUpdated'))
    } else {
      alert('Все рекомендуемые книги уже добавлены в вашу библиотеку')
    }
  }

  return (
    <div className="suggested-panel">
      <div className="panel-header">
        <h3 className="panel-title">
          📚 Рекомендуемые книги
          <span className="book-count">({suggestedBooks.length})</span>
        </h3>
        
        <div className="panel-actions">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="btn btn-outline"
          >
            {expanded ? 'Свернуть' : 'Развернуть'}
          </button>
          
          <button 
            onClick={handleAddAll}
            className="btn btn-primary"
          >
            Добавить все в мою библиотеку
          </button>
          
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showSuggested}
              onChange={toggleShowSuggested}
              className="toggle-input"
            />
            <span className="toggle-slider"></span>
            <span className="toggle-text">
              {showSuggested ? 'Показаны' : 'Скрыты'}
            </span>
          </label>
        </div>
      </div>

      <div className="panel-description">
        <p>Это коллекция рекомендованных технических книг. Вы можете добавить их в свою библиотеку или скрыть из вида.</p>
      </div>

      {expanded && (
        <div className="suggested-grid">
          {suggestedBooks.map(book => (
            <SuggestedBookCard 
              key={book.id} 
              book={book} 
              isAdded={isBookAdded(book.id)}
            />
          ))}
        </div>
      )}

      <div className="panel-footer">
        <small>Книги хранятся в Supabase и доступны всем пользователям</small>
      </div>
    </div>
  )
}