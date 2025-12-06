'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface LocalBook {
  id: string
  title: string
  author: string
  description?: string
  pdfUrl: string
  fileName: string
  addedAt: Date
  tags?: string[]
  isSuggested?: boolean
  suggestedId?: string
}

export function useLocalLibrary() {
  const [showSuggested, setShowSuggested] = useState(true)
  const [books, setBooks] = useState<LocalBook[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    // Загружаем настройку показа предустановленных книг
    const savedShowSuggested = localStorage.getItem('show_suggested')
    if (savedShowSuggested !== null) {
      setShowSuggested(JSON.parse(savedShowSuggested))
    }
  }, [])

  const toggleShowSuggested = () => {
  const newValue = !showSuggested
  setShowSuggested(newValue)
  localStorage.setItem('show_suggested', JSON.stringify(newValue))
  }

  const removeAllSuggested = () => {
    const updatedBooks = books.filter(book => !book.isSuggested)
    saveLibrary(updatedBooks)
  }

  const toggleSuggestedBook = (id: string, visible: boolean) => {
  const updatedBooks = books.map(book => 
    book.id === id ? { ...book, hidden: !visible } : book
  )
  saveLibrary(updatedBooks)
}

  const getDisplayedBooks = () => {
    return books.filter(book => {
      if (book.isSuggested && !showSuggested) {
        return false // Скрываем предустановленные книги
      }
      return true
    })
  }

  const loadLibrary = useCallback(() => {
    try {
      const stored = localStorage.getItem('personal_library')
      if (stored) {
        const parsed = JSON.parse(stored)
        const booksWithDates = (parsed.books || []).map((book: LocalBook) => ({
          ...book,
          addedAt: new Date(book.addedAt)
        }))
        setBooks(booksWithDates)
      }
    } catch (error) {
      console.error('Error loading library:', error)
      setBooks([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLibrary()
  }, [loadLibrary])

  const saveLibrary = useCallback((newBooks: LocalBook[]) => {
    try {
      const library = {
        books: newBooks,
        updatedAt: new Date().toISOString(),
        userId: getDeviceId()
      }
      localStorage.setItem('personal_library', JSON.stringify(library))
      setBooks(newBooks)
    } catch (error) {
      console.error('Error saving library:', error)
    }
  }, [])

  const addBook = useCallback((book: Omit<LocalBook, 'id' | 'addedAt'>) => {
    const newBook: LocalBook = {
      ...book,
      id: generateId(),
      addedAt: new Date()
    }
    const updatedBooks = [...books, newBook]
    saveLibrary(updatedBooks)
    return newBook
  }, [books, saveLibrary])

  const removeBook = useCallback(async (id: string) => {
    setDeletingId(id) // Начинаем удаление
    
    try {
      // Находим книгу для удаления
      const bookToDelete = books.find(book => book.id === id)
      if (!bookToDelete) {
        throw new Error('Книга не найдена')
      }
      
      // 1. Сначала удаляем файл из Supabase Storage
      const fileName = bookToDelete.fileName
      if (fileName) {
        try {
          const filePath = `personal/${getDeviceId()}/${fileName}`
          const { error: storageError } = await supabase.storage
            .from('pdfs')
            .remove([filePath])
          
          if (storageError) {
            console.warn('Не удалось удалить файл из Supabase:', storageError)
            // Продолжаем удалять из библиотеки даже если файл не удалился
          }
        } catch (storageError) {
          console.warn('Ошибка при удалении файла:', storageError)
        }
      }
      
      // 2. Удаляем книгу из локальной библиотеки
      const updatedBooks = books.filter(book => book.id !== id)
      saveLibrary(updatedBooks)
      
      return true // Успешное удаление
    } catch (error) {
      console.error('Error removing book:', error)
      throw error
    } finally {
      setDeletingId(null) // Завершаем удаление
    }
  }, [books, saveLibrary])

  const updateBook = useCallback((id: string, updates: Partial<LocalBook>) => {
    const updatedBooks = books.map(book =>
      book.id === id ? { ...book, ...updates } : book
    )
    saveLibrary(updatedBooks)
  }, [books, saveLibrary])

  const clearLibrary = useCallback(async () => {
    try {
      // Удаляем все файлы пользователя из Supabase
      const { data: fileList } = await supabase.storage
        .from('pdfs')
        .list(`personal/${getDeviceId()}`)
      
      if (fileList && fileList.length > 0) {
        const filesToDelete = fileList.map(file => 
          `personal/${getDeviceId()}/${file.name}`
        )
        await supabase.storage
          .from('pdfs')
          .remove(filesToDelete)
      }
    } catch (error) {
      console.warn('Не удалось очистить файлы из Supabase:', error)
    }
    
    // Очищаем локальную библиотеку
    localStorage.removeItem('personal_library')
    setBooks([])
  }, [])

  return {
    books,
    displayedBooks: getDisplayedBooks(),
    isLoading,
    showSuggested,
    toggleShowSuggested,
    removeAllSuggested,
    toggleSuggestedBook,
    deletingId,
    addBook,
    removeBook,
    updateBook,
    clearLibrary,
    reload: loadLibrary
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function getDeviceId(): string {
  let deviceId = localStorage.getItem('device_id')
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('device_id', deviceId)
  }
  return deviceId
}