import React from 'react';
import { motion } from 'motion/react';
import { Bookmark, BookmarkCheck, Check, Star, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../../types/movie';
import { MoviePoster } from './MoviePoster';
import { useWatchlist } from '../../hooks/useWatchlist';
import { formatRuntime } from '../../lib/utils';

interface MovieCardProps {
  movie: Movie;
  onQuickView?: (movie: Movie) => void;
  layout?: 'grid' | 'list';
  index?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onQuickView,
  layout = 'grid',
  index = 0
}) => {
  const navigate = useNavigate();
  const { isSaved, isWatched, toggleWatchlist } = useWatchlist();

  const saved = isSaved(movie.id);
  const watched = isWatched(movie.id);

  const handleCardClick = () => {
    navigate(`/movie/${movie.slug || movie.id}`);
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWatchlist(movie.id, movie.title);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onQuickView) onQuickView(movie);
  };

  if (layout === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
        onClick={handleCardClick}
        className="group relative flex items-center gap-4 p-3 rounded-2xl bg-cinema-surface border border-cinema-border hover:border-brand-violet/40 hover:shadow-card-elevated transition-all cursor-pointer select-none"
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`View details for ${movie.title}`}
      >
        <div className="w-16 sm:w-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
          <MoviePoster
            posterUrl={movie.posterUrl}
            title={movie.title}
            year={movie.year}
            genre={movie.genres[0]}
            className="w-full aspect-[2/3]"
          />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-semibold text-brand-violet">
              {movie.genres[0]}
            </span>
            <span className="text-xs text-cinema-muted">•</span>
            <span className="text-xs text-cinema-muted">{movie.year}</span>
            {movie.runtimeMinutes && (
              <>
                <span className="text-xs text-cinema-muted">•</span>
                <span className="text-xs text-cinema-muted">
                  {formatRuntime(movie.runtimeMinutes)}
                </span>
              </>
            )}
          </div>

          <h3 className="font-display font-bold text-base sm:text-lg text-cinema-text group-hover:text-brand-violet transition-colors truncate">
            {movie.title}
          </h3>

          <p className="text-xs text-cinema-muted line-clamp-1 mt-0.5 max-w-xl">
            {movie.overview}
          </p>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {movie.rating !== undefined && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-sunshine/10 text-brand-sunshine text-xs font-bold border border-brand-sunshine/20">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleWatchlistClick}
            className={`p-2 rounded-xl transition-all ${
              saved
                ? 'bg-brand-violet text-white shadow-cinema-glow'
                : 'text-cinema-muted hover:text-cinema-text hover:bg-cinema-subtle'
            }`}
            aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
            title={saved ? 'In Watchlist' : 'Add to Watchlist'}
          >
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-2xl bg-cinema-surface border border-cinema-border hover:border-brand-violet/50 hover:shadow-cinema-glow transition-all duration-300 cursor-pointer overflow-hidden select-none focus:outline-none focus:ring-2 focus:ring-brand-violet/80"
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View details for ${movie.title}`}
    >
      {/* Poster Container */}
      <div className="relative w-full overflow-hidden bg-cinema-elevated">
        <div className="transform transition-transform duration-500 ease-out group-hover:scale-105">
          <MoviePoster
            posterUrl={movie.posterUrl}
            title={movie.title}
            year={movie.year}
            genre={movie.genres[0]}
            className="w-full aspect-[2/3]"
          />
        </div>

        {/* Gradient Overlay for Top Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Floating Controls */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
          {/* Rating Badge */}
          {movie.rating !== undefined ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/65 backdrop-blur-md text-brand-sunshine text-xs font-bold border border-white/10 shadow-sm">
              <Star className="w-3 h-3 fill-current" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          ) : (
            <div />
          )}

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1">
            {watched && (
              <span
                className="p-1.5 rounded-lg bg-brand-aqua text-black shadow-sm"
                title="Watched"
                aria-label="Watched movie"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}

            <button
              type="button"
              onClick={handleWatchlistClick}
              className={`p-1.5 rounded-lg backdrop-blur-md transition-transform active:scale-90 ${
                saved
                  ? 'bg-brand-violet text-white shadow-cinema-glow'
                  : 'bg-black/60 text-white/90 hover:bg-black/85 hover:text-white border border-white/10'
              }`}
              aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
              title={saved ? 'In Watchlist' : 'Add to Watchlist'}
            >
              {saved ? (
                <BookmarkCheck className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Quick Details Trigger button (Reveals on hover desktop, visible touch) */}
        {onQuickView && (
          <div className="absolute bottom-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold hover:bg-brand-violet transition-colors border border-white/15 shadow-sm"
              aria-label="Quick preview"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Metadata */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-cinema-surface">
        <div>
          <div className="flex items-center justify-between gap-1 text-[11px] text-cinema-muted mb-1 font-medium">
            <span className="text-brand-violet font-semibold truncate max-w-[65%]">
              {movie.genres[0]}
            </span>
            <span>{movie.year}</span>
          </div>

          <h3 className="font-display font-bold text-sm sm:text-base text-cinema-text line-clamp-1 group-hover:text-brand-violet transition-colors">
            {movie.title}
          </h3>
        </div>

        {movie.runtimeMinutes && (
          <div className="mt-2 pt-2 border-t border-cinema-border/60 flex items-center justify-between text-[11px] text-cinema-muted">
            <span>{formatRuntime(movie.runtimeMinutes)}</span>
            {movie.director && (
              <span className="truncate max-w-[60%] text-right">
                {movie.director}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
