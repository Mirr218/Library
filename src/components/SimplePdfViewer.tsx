'use client';

import { useState } from 'react';

interface SimplePdfViewerProps {
  url: string;
  title?: string;
}

export default function SimplePdfViewer({ url, title = 'PDF Документ' }: SimplePdfViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Используем Google Docs Viewer для отображения PDF
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  const handleIframeLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setError('Не удалось загрузить PDF документ через Google Viewer. Попробуйте скачать файл.');
    setLoading(false);
  };

  return (
    <div className="simple-pdf-viewer">
      {loading && (
        <div className="viewer-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка PDF через Google Docs Viewer...</p>
          <p className="loading-hint">Это может занять несколько секунд</p>
        </div>
      )}
      
      {error && (
        <div className="viewer-error">
          <div className="error-icon">⚠️</div>
          <h4>Ошибка загрузки</h4>
          <p>{error}</p>
          <div className="error-actions">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              ↗️ Открыть в новой вкладке
            </a>
          </div>
        </div>
      )}
      
      <iframe
        src={googleViewerUrl}
        title={`Google Docs Viewer: ${title}`}
        className="pdf-iframe"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{
          width: '100%',
          height: 'calc(100vh - 200px)',
          minHeight: '600px',
          border: 'none',
          display: (loading || error) ? 'none' : 'block',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}
        allow="fullscreen"
      />
      
      <div className="viewer-actions" style={{ display: loading ? 'none' : 'flex' }}>
        <a 
          href={googleViewerUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          ↗️ Открыть в Google Viewer
        </a>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          ↗️ Открыть напрямую
        </a>
        <a 
          href={url} 
          download
          className="btn btn-primary"
        >
          ⬇️ Скачать PDF
        </a>
      </div>
      
      <div className="viewer-help">
        <p><strong>Примечание:</strong> PDF отображается через Google Docs Viewer для совместимости.</p>
        <ul>
          <li>Google Viewer поддерживает поиск, масштабирование и печать</li>
          <li>Оригинальный файл всегда доступен для скачивания</li>
          <li>Для приватных файлов используйте прямое скачивание</li>
        </ul>
      </div>
    </div>
  );
}