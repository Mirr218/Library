'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LocalBook, SuggestedBook } from '@/types/book'

export function useSuggestedBooks() {
  const [suggestedBooks, setSuggestedBooks] = useState<SuggestedBook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSuggestedBooks = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('suggested_books')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      setSuggestedBooks(data || [])
      } catch (error: unknown) {
    console.error('Error loading suggested books:', error);
    if (typeof error === 'object' && error !== null && 'message' in error) {
      setError((error as { message: string }).message);
    } else if (typeof error === 'string') {
      setError(error);
    } else {
      setError('An unknown error occurred');
    }
  } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSuggestedBooks()
  }, [])

  // Добавить предложенную книгу в личную библиотеку
  const addToLibrary = async (suggestedBook: SuggestedBook): Promise<boolean> => {
    try {
      const personalLibrary = JSON.parse(localStorage.getItem('personal_library') || '{"books": []}')
      
      const newBook = {
        id: `suggested_${suggestedBook.id}`,
        title: suggestedBook.title,
        author: suggestedBook.author,
        description: suggestedBook.description,
        pdfUrl: suggestedBook.pdf_url,
        fileName: suggestedBook.file_name,
        addedAt: new Date(),
        tags: suggestedBook.tags,
        isSuggested: true,
        suggestedId: suggestedBook.id
      }

      personalLibrary.books.push(newBook)
      localStorage.setItem('personal_library', JSON.stringify(personalLibrary))
      return true
    } catch (error) {
      console.error('Error adding suggested book to library:', error)
      return false
    }
  }

  // Добавить все предложенные книги в библиотеку
  const addAllToLibrary = async (): Promise<number> => {
    try {
      const personalLibrary = JSON.parse(localStorage.getItem('personal_library') || '{"books": []}')
      const existingSuggestedIds = new Set(
        personalLibrary.books
          .filter((b: LocalBook) => b.isSuggested)
          .map((b: LocalBook) => b.suggestedId)
      )

      let addedCount = 0
      for (const suggestedBook of suggestedBooks) {
        if (!existingSuggestedIds.has(suggestedBook.id)) {
          const newBook = {
            id: `suggested_${suggestedBook.id}`,
            title: suggestedBook.title,
            author: suggestedBook.author,
            description: suggestedBook.description,
            pdfUrl: suggestedBook.pdf_url,
            fileName: suggestedBook.file_name,
            addedAt: new Date(),
            tags: suggestedBook.tags,
            isSuggested: true,
            suggestedId: suggestedBook.id
          }
          personalLibrary.books.push(newBook)
          addedCount++
        }
      }

      if (addedCount > 0) {
        localStorage.setItem('personal_library', JSON.stringify(personalLibrary))
      }
      return addedCount
    } catch (error) {
      console.error('Error adding all suggested books:', error)
      return 0
    }
  }

  // Проверить, добавлена ли уже книга в библиотеку
  const isBookAdded = (suggestedBookId: string): boolean => {
    try {
      const personalLibrary = JSON.parse(localStorage.getItem('personal_library') || '{"books": []}')
      return personalLibrary.books.some((book: LocalBook) => book.suggestedId === suggestedBookId)
    } catch {
      return false
    }
  }

  return {
    suggestedBooks,
    loading,
    error,
    addToLibrary,
    addAllToLibrary,
    isBookAdded,
    reload: loadSuggestedBooks
  }
}