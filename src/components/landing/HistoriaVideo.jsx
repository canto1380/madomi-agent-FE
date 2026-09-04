import { useRef, useState } from 'react';

const VIDEO_SRC = '/VideoEmpresa.mp4';

export function HistoriaVideo() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('loading');

  const handleRetry = () => {
    setStatus('loading');
    const video = videoRef.current;
    if (video) {
      video.load();
    }
  };

  return (
    <div className="historiaVideo">
      {status === 'loading' && (
        <div className="historiaVideoOverlay" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <p className="historiaVideoStatus">Cargando video de nuestra historia</p>
        </div>
      )}

      {status === 'error' && (
        <div className="historiaVideoOverlay historiaVideoOverlayError" role="alert">
          <p className="historiaVideoStatus">No se pudo cargar el video.</p>
          <button type="button" className="historiaVideoRetry" onClick={handleRetry}>
            Reintentar
          </button>
        </div>
      )}

      <video
        ref={videoRef}
        className={`historiaVideoPlayer ${status === 'ready' ? 'historiaVideoPlayerVisible' : ''}`}
        controls
        preload="metadata"
        playsInline
        autoPlay
        muted
        loop
        onLoadedData={() => setStatus('ready')}
        onCanPlay={() => setStatus((prev) => (prev === 'error' ? prev : 'ready'))}
        onError={() => setStatus('error')}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
        Tu navegador no soporta la reproducción de video.
      </video>
    </div>
  );
}
