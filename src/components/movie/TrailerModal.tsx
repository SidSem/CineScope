import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Film } from 'lucide-react';
import { getSafeTrailerEmbedUrl } from '../../lib/urlValidation';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
  trailerUrl?: string;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  movieTitle,
  trailerUrl
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const embedUrl = getSafeTrailerEmbedUrl(trailerUrl);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl rounded-2xl cinema-glass border border-cinema-border shadow-2xl bg-cinema-surface overflow-hidden z-10"
            role="dialog"
            aria-label={`${movieTitle} Official Trailer`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-cinema-border">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-brand-violet" />
                <h3 className="font-display font-bold text-cinema-text text-base sm:text-lg">
                  {movieTitle} — Official Trailer
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {trailerUrl && (
                  <a
                    href={trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-cinema-muted hover:text-cinema-text hover:bg-cinema-subtle rounded-lg transition-colors text-xs flex items-center gap-1 font-semibold"
                    title="Watch on official platform"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">Open External</span>
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 text-cinema-muted hover:text-cinema-text hover:bg-cinema-subtle rounded-lg transition-colors"
                  aria-label="Close trailer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video w-full bg-black">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${movieTitle} trailer video player`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Film className="w-12 h-12 text-cinema-muted mb-3 opacity-50" />
                  <p className="text-cinema-text font-semibold mb-2">
                    Verified Video Stream Unavailable
                  </p>
                  <p className="text-xs text-cinema-muted max-w-sm mb-4">
                    For your security and verified licensing, external trailers can only be streamed from certified providers.
                  </p>
                  {trailerUrl && (
                    <a
                      href={trailerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-violet text-white hover:bg-brand-violet/90 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Watch on Video Provider
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
