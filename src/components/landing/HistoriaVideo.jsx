import { useEffect, useRef, useState } from 'react';
import { useSiteContenido } from '../../providers/SiteContenidoProvider.jsx';
import { getMediaUrl } from '../../utils/mergeSiteContenido.js';

export function HistoriaVideo() {
  const { site } = useSiteContenido();
  const videoSrc = getMediaUrl(site, 'video-empresa', '/VideoEmpresa.mp4');
  const videoPoster = getMediaUrl(site, 'video-empresa-poster', '/VideoEmpresa-poster.jpg');

  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return undefined;

    setStatus('loading');
    const video = videoRef.current;
    if (!video) return undefined;

    const playPromise = video.play?.();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        /* autoplay bloqueado — el usuario puede iniciar con controles */
      });
    }

    return undefined;
  }, [inView, videoSrc]);

  const handleRetry = () => {
    setStatus('loading');
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play?.().catch(() => {});
    }
  };

  return (
    <div className="historiaVideo" ref={rootRef}>
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
        preload={inView ? 'metadata' : 'none'}
        poster={videoPoster}
        playsInline
        muted
        loop
        onLoadedData={() => setStatus('ready')}
        onCanPlay={() => setStatus((prev) => (prev === 'error' ? prev : 'ready'))}
        onError={() => setStatus('error')}
      >
        {inView ? <source src={videoSrc} type="video/mp4" /> : null}
        Tu navegador no soporta la reproducción de video.
      </video>
    </div>
  );
}
