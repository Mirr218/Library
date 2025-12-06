'use client'

import { useEffect, useState } from 'react'
import { useParams  } from 'next/navigation'
import Link from 'next/link'
import { LocalBook } from '..//../hooks/useLocalLibrary'
import SimplePdfViewer from '@/components/SimplePdfViewer'

export default function BookPage() {
  const params = useParams()
  const [book, setBook] = useState<LocalBook | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('personal_library')
      if (stored) {
        const library = JSON.parse(stored)
        const foundBook = library.books?.find((b: LocalBook) => b.id === params.id)
        
        if (foundBook) {
          setBook(foundBook)
        }
      }
    } catch (error) {
      console.error('Error loading book:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return (
      <main className="container">
        <div className="loading">Загрузка книги...</div>
      </main>
    )
  }

  if (!book) {
    return (
      <main className="container">
        <div className="error-message">
          <h2>Книга не найдена</h2>
          <p>Возможно, она была удалена из вашей библиотеки</p>
          <Link href="/" className="btn btn-primary">
            Вернуться в библиотеку
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container">
      <div className="page-header">
        <Link href="/" className="back-link">
          ← Назад в библиотеку
        </Link>
        <div className="book-header">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">Автор: {book.author}</p>
          {book.description && (
            <p className="book-description">{book.description}</p>
          )}
        </div>
      </div>

      <div className="pdf-container">
        <SimplePdfViewer url={book.pdfUrl} title={book.title} />
      </div>
    </main>
  )
}