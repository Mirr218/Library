'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLocalLibrary } from '../hooks/useLocalLibrary'

export default function AddBookPage() {
  const router = useRouter()
  const { addBook } = useLocalLibrary()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    file: null as File | null
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.file) {
        alert('Пожалуйста, выберите PDF файл')
        return
      }

      // 1. Проверяем размер файла (макс 10MB)
      if (formData.file.size > 10 * 1024 * 1024) {
        alert('Файл слишком большой. Максимальный размер: 10MB')
        return
      }

      // 2. Проверяем тип файла
      if (formData.file.type !== 'application/pdf') {
        alert('Пожалуйста, выберите PDF файл')
        return
      }

      // 3. Генерируем уникальное имя файла
      const fileExt = formData.file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      const filePath = `personal/${getDeviceId()}/${fileName}`

      // 4. Загружаем в Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(filePath, formData.file)

      if (uploadError) {
        throw new Error(`Ошибка загрузки: ${uploadError.message}`)
      }

      // 5. Получаем публичную ссылку
      const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(filePath)

      // 6. Сохраняем в локальную библиотеку
      addBook({
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim() || undefined,
        pdfUrl: publicUrl,
        fileName: fileName
      })

      // 7. Перенаправляем на главную
      alert('Книга успешно добавлена в вашу библиотеку!')
      router.push('/')
      router.refresh()

    } catch (error: unknown) {
      console.error('Error:', error)
      alert(`Ошибка: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <div className="page-header">
        <Link href="/" className="back-link">← Назад в библиотеку</Link>
        <h1 className="main-title">Добавить книгу</h1>
        <p className="page-subtitle">Книга сохранится только в вашем браузере</p>
      </div>

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="title">Название книги *</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            className="form-input"
            placeholder="Введите название"
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Автор *</label>
          <input
            type="text"
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            required
            className="form-input"
            placeholder="Введите автора"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание (необязательно)</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className="form-textarea"
            placeholder="Краткое описание"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pdf">PDF файл * (макс. 10MB)</label>
          <input
            type="file"
            id="pdf"
            accept=".pdf,application/pdf"
            onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})}
            required
            className="form-file"
          />
          {formData.file && (
            <p className="file-info">
              Выбран файл: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Добавление...' : 'Добавить в мою библиотеку'}
          </button>
          <Link href="/" className="btn btn-outline">Отмена</Link>
        </div>

        <div className="form-note">
          <p>📘 Книга сохранится в вашем браузере. При очистке данных браузера библиотека удалится.</p>
          <p>🔄 Чтобы перенести библиотеку на другое устройство, используйте экспорт/импорт.</p>
        </div>
      </form>
    </main>
  )
}

function getDeviceId(): string {
  let deviceId = localStorage.getItem('device_id')
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('device_id', deviceId)
  }
  return deviceId
}