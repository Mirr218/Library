'use client'

import { useState } from 'react'
import BookCard from './BookCard'
import { LocalBook } from '../app/hooks/useLocalLibrary'

interface BookCatalogProps {
  books: LocalBook[]
}

export default function BookCatalog({ books }: BookCatalogProps) {
  const [search, setSearch] = useState('')

  const filteredBooks = books.filter(book => {
    if (!search) return true
    
    const searchLower = search.toLowerCase()
    return (
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      (book.description?.toLowerCase().includes(searchLower)) ||
      (book.tags?.some(tag => tag.toLowerCase().includes(searchLower)))
    )
  })

  // Если книги обновились, этот компонент перерисуется
  
  if (filteredBooks.length === 0) {
    return (
      <div className="no-results">
        {search ? (
          <p>По запросу "{search}" ничего не найдено</p>
        ) : (
          <p>В библиотеке нет книг</p>
        )}
      </div>
    )
  }

  return (
    <div>
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
        </div>
      </div>

      <div className="book-grid">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}