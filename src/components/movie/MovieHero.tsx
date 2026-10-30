import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Pause, Star, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Movie } from '../../types/movie';
import { useWatchlist } from '../../hooks/useWatchlist';
import { formatRuntime } from '../../lib/utils';

interface MovieHeroProps {
  movies: Movie[];
  onOpenTrailer?: (trailerUrl?: string) => void;
}

export const MovieHero: React.FC<MovieHeroProps> = ({ movies, onOpenTrailer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window !== 'undefined') {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return true;
  });
  const timerRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const { isSaved, toggleWatchlist } = useWatchlist();

  const featuredList = movies.length > 0 ? movies : [];
  const currentMovie = featuredList[currentIndex];

  const handleNext = useCallback(() => {
    if (featuredList.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % featuredList.length);
  }, [featuredList.length]);

  const handlePrev = useCallback(() => {
    if (featuredList.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + featuredList.length) % featuredList.length);
  }, [featuredList.length]);

  // Autoplay management
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotion = (e: MediaQueryListEvent) => {
      if (e.matches) setIsPlaying(false);
    };
    mediaQuery.addEventListener('change', handleReducedMotion);

    if (isPlaying && !mediaQuery.matches && featuredList.length > 1) {
      timerRef.current = window.setInterval(() => {
        handleNext();
      }, 7000);
    }
    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotion);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, handleNext, featuredList.length]);

  // Pause when tab is not visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPlaying(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  if (!currentMovie) return null;

  const saved = isSaved(currentMovie.id);

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden cinema-glass border border-cinema-border shadow-2xl mb-10 group"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Movies"
    >
      {/* Background Backdrop with Gradient Overlays */}
      <div className="relative h-[480px] sm:h-[540px] md:h-[600px] w-full overflow-hidden bg-cinema-elevated">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentMovie.id}
            src={currentMovie.backdropUrl || currentMovie.posterUrl}
            alt={`${currentMovie.title} backdrop`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.1]"
          />
        </AnimatePresence>

        {/* Ambient atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg via-cinema-bg/80 to-transparent sm:w-2/3" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(118,87,255,0.15),transparent_50%)]" />
      </div>

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-end z-10">
        <div className="max-w-2xl">
          {/* Top Pill Metadata */}
          <div className="flex items-center gap-2.5 flex-wrap mb-3.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brand-violet to-brand-pink text-white shadow-cinema-glow">
              Featured Premiere
            </span>

            {currentMovie.rating !== undefined && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-sunshine/15 text-brand-sunshine border border-brand-sunshine/30 backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-current" />
                {currentMovie.rating.toFixed(1)}
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-xs text-white/80 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {currentMovie.year}
            </span>

            {currentMovie.runtimeMinutes && (
              <span className="inline-flex items-center gap-1 text-xs text-white/80 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {formatRuntime(currentMovie.runtimeMinutes)}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-[1.1] mb-3">
            {currentMovie.title}
          </h1>

          {/* Genres Chips */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {currentMovie.genres.map(genre => (
              <Link
                key={genre}
                to={`/genres/${genre.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors border border-white/10"
              >
                {genre}
              </Link>
            ))}
          </div>

          {/* Overview */}
          <p className="text-sm sm:text-base text-white/80 line-clamp-2 sm:line-clamp-3 leading-relaxed mb-6 max-w-xl">
            {currentMovie.overview}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate(`/movie/${currentMovie.slug || currentMovie.id}`)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-violet to-brand-pink text-white hover:opacity-95 shadow-cinema-glow transition-all active:scale-95"
            >
              <span>Explore Movie</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleWatchlist(currentMovie.id, currentMovie.title)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm backdrop-blur-md transition-all active:scale-95 ${
                saved
                  ? 'bg-brand-violet text-white shadow-cinema-glow border border-brand-violet'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
              }`}
            >
              {saved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
              <span>{saved ? 'Saved to Watchlist' : 'Add to Watchlist'}</span>
            </button>

            {currentMovie.trailerUrl && onOpenTrailer && (
              <button
                onClick={() => onOpenTrailer(currentMovie.trailerUrl)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-black/40 text-white hover:bg-black/60 border border-white/15 backdrop-blur-md transition-colors"
                aria-label={`Play trailer for ${currentMovie.title}`}
              >
                <Play className="w-4 h-4 fill-current text-brand-pink" />
                <span className="hidden sm:inline">Trailer</span>
              </button>
            )}
          </div>
        </div>

        {/* Carousel Controls Bottom Right */}
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 flex items-center gap-3 z-20">
          {/* Dots Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            {featuredList.map((movie, idx) => (
              <button
                key={movie.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-brand-violet' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-black/50 text-white/80 hover:text-white hover:bg-black/75 border border-white/10 backdrop-blur-md transition-colors"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          {/* Prev/Next */}
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-xl bg-black/50 text-white/80 hover:text-white hover:bg-black/75 border border-white/10 backdrop-blur-md transition-colors"
            aria-label="Previous featured movie"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-xl bg-black/50 text-white/80 hover:text-white hover:bg-black/75 border border-white/10 backdrop-blur-md transition-colors"
            aria-label="Next featured movie"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
