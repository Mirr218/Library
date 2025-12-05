export interface SuggestedBook {
  id: string
  title: string
  author: string
  description?: string
  pdf_url: string
  file_name: string
  category?: string
  difficulty_level?: 'Начинающий' | 'Средний' | 'Продвинутый'
  tags?: string[]
  created_at: string
}

export interface LocalBook {
  id: string
  title: string
  author: string
  description?: string
  pdfUrl: string
  fileName: string
  addedAt: Date
  tags?: string[]
  isSuggested?: boolean // Флаг, что книга из предустановленных
  suggestedId?: string // ID из таблицы suggested_books
}