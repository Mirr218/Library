'use client'

import { useState, useEffect } from 'react'

interface SimplePdfViewerProps {
  url: string;
  title?: string;
}

export default function SimplePdfViewer({ url, title = 'PDF Документ' }: SimplePdfViewerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [iframeUrl, setIframeUrl] = useState('')

  useEffect(() => {
    // Проверяем, доступен ли файл напрямую
    const checkFileAccess = async () => {
      try {
        const response = await fetch(url, { method: 'HEAD' })
        
        if (response.ok) {
          // Файл доступен напрямую
          setIframeUrl(`${url}#view=FitH`)
        } else {
          // Используем Google Docs Viewer как fallback
          const googleUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
          setIframeUrl(googleUrl)
        }
      } catch (_err) {
        // При ошибке используем Google Docs Viewer
        const googleUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
        setIframeUrl(googleUrl)
      }
    }

    checkFileAccess()
  }, [url])

  return (
    <div className="simple-pdf-viewer">
      {loading && (
        <div className="viewer-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка PDF документа...</p>
        </div>
      )}
      
      {error && (
        <div className="viewer-error">
          <p>{error}</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Открыть в новой вкладке
          </a>
        </div>
      )}
      
      <iframe
        src={iframeUrl}
        title={title}
        className="pdf-iframe"
        onLoad={() => setLoading(false)}
        onError={() => {
          setError('Предварительный просмотр недоступен. Файл может быть защищён или недоступен.')
          setLoading(false)
        }}
        style={{
          width: '100%',
          height: '800px',
          border: 'none',
          display: loading || error ? 'none' : 'block'
        }}
      />
      
      <div className="viewer-actions" style={{ display: loading || error ? 'none' : 'flex' }}>
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          Открыть в новой вкладке
        </a>
        <a href={url} download className="btn btn-primary">
          Скачать PDF
        </a>
      </div>
    </div>
  )
}