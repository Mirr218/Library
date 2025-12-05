'use client'

import { useState, useMemo } from 'react'
import BookCard from './BookCard'
import { LocalBook } from '../app/hooks/useLocalLibrary'

interface BookCatalogProps {
  books: LocalBook[]
}

export default function BookCatalog({ books }: BookCatalogProps) {
  const [search, setSearch] = useState('')

  // Используем useMemo для мгновенной фильтрации без лагов
  const filteredBooks = useMemo(() => {
    if (!search) return books
    
    const searchLower = search.toLowerCase()
    return books.filter(book => {
      return (
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        (book.description?.toLowerCase().includes(searchLower)) ||
        (book.tags?.some(tag => tag.toLowerCase().includes(searchLower)))
      )
    })
  }, [books, search])

  return (
    <div className="book-catalog">
      {/* Поисковая строка - всегда отображается */}
      <div className="search-section">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Поиск по названию, автору, тегам..."
          className="search-input"
        />
        <div className="search-info">
          Найдено: {filteredBooks.length} из {books.length} книг
          {search && filteredBooks.length === 0 && (
            <span className="no-results-indicator"> • Нет результатов</span>
          )}
        </div>
      </div>

      {/* Сообщение о пустом результате */}
      {search && filteredBooks.length === 0 && (
        <div className="no-results-message">
          <div className="no-results-icon">🔍</div>
          <h3>По запросу "{search}" ничего не найдено</h3>
          <p>Попробуйте изменить запрос или проверьте орфографию</p>
          <button 
            onClick={() => setSearch('')}
            className="btn btn-outline"
          >
            Очистить поиск
          </button>
        </div>
      )}

      {/* Сетка книг - показываем только если есть результаты ИЛИ если нет поиска */}
      {(!search || filteredBooks.length > 0) && (
        <div className="book-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}