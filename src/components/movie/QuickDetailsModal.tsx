import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bookmark, BookmarkCheck, Check, Star, Clock, Calendar, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie } from '../../types/movie';
import { MoviePoster } from './MoviePoster';
import { useWatchlist } from '../../hooks/useWatchlist';
import { formatRuntime } from '../../lib/utils';

interface QuickDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenTrailer?: (trailerUrl?: string) => void;
}

export const QuickDetailsModal: React.FC<QuickDetailsModalProps> = ({
  movie,
  isOpen,
  onClose,
  onOpenTrailer
}) => {
  const { isSaved, isWatched, toggleWatchlist, toggleWatched } = useWatchlist();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!movie) return null;

  const saved = isSaved(movie.id);
  const watched = isWatched(movie.id);

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
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl rounded-2xl cinema-glass border border-cinema-border shadow-2xl bg-cinema-surface overflow-hidden z-10 text-cinema-text"
            role="dialog"
            aria-label={`${movie.title} quick preview`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors backdrop-blur-md"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row">
              {/* Poster Section */}
              <div className="w-full sm:w-1/3 flex-shrink-0 relative">
                <MoviePoster
                  posterUrl={movie.posterUrl}
                  title={movie.title}
                  year={movie.year}
                  genre={movie.genres[0]}
                  className="w-full h-64 sm:h-full object-cover"
                />
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {movie.rating !== undefined && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-sunshine/15 text-brand-sunshine border border-brand-sunshine/30">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {movie.rating.toFixed(1)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-cinema-muted">
                      <Calendar className="w-3 h-3" />
                      {movie.year}
                    </span>
                    {movie.runtimeMinutes && (
                      <span className="inline-flex items-center gap-1 text-xs text-cinema-muted">
                        <Clock className="w-3 h-3" />
                        {formatRuntime(movie.runtimeMinutes)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-display text-cinema-text leading-tight mb-2">
                    {movie.title}
                  </h3>

                  <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    {movie.genres.map(g => (
                      <span
                        key={g}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-cinema-elevated text-brand-violet border border-cinema-border"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-cinema-muted line-clamp-4 leading-relaxed mb-4">
                    {movie.overview}
                  </p>

                  {movie.director && (
                    <p className="text-xs text-cinema-muted mb-1">
                      <span className="font-semibold text-cinema-text">Director:</span> {movie.director}
                    </p>
                  )}

                  {movie.cast && movie.cast.length > 0 && (
                    <p className="text-xs text-cinema-muted line-clamp-1 mb-4">
                      <span className="font-semibold text-cinema-text">Cast:</span> {movie.cast.join(', ')}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-cinema-border flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWatchlist(movie.id, movie.title)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        saved
                          ? 'bg-brand-violet text-white shadow-cinema-glow'
                          : 'bg-cinema-elevated text-cinema-text hover:bg-brand-violet/20 border border-cinema-border'
                      }`}
                    >
                      {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      <span>{saved ? 'In Watchlist' : 'Watchlist'}</span>
                    </button>

                    <button
                      onClick={() => toggleWatched(movie.id, movie.title)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        watched
                          ? 'bg-brand-aqua text-black font-bold'
                          : 'bg-cinema-elevated text-cinema-muted hover:text-cinema-text border border-cinema-border'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{watched ? 'Watched' : 'Mark Watched'}</span>
                    </button>

                    {movie.trailerUrl && onOpenTrailer && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenTrailer(movie.trailerUrl);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cinema-elevated text-cinema-text hover:bg-brand-pink/20 hover:text-brand-pink border border-cinema-border transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Trailer</span>
                      </button>
                    )}
                  </div>

                  <Link
                    to={`/movie/${movie.slug || movie.id}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-violet hover:text-brand-pink transition-colors ml-auto py-1"
                  >
                    <span>Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
