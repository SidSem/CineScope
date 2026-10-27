import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie } from '../../types/movie';
import { MovieCard } from './MovieCard';
import { QuickDetailsModal } from './QuickDetailsModal';

interface MovieRailProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  exploreLink?: string;
  exploreLabel?: string;
  numbered?: boolean;
  onOpenTrailer?: (trailerUrl?: string) => void;
}

export const MovieRail: React.FC<MovieRailProps> = ({
  title,
  subtitle,
  movies,
  exploreLink,
  exploreLabel = 'See all',
  numbered = false,
  onOpenTrailer
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (movies.length === 0) return null;

  return (
    <section className="relative my-8 sm:my-12">
      {/* Rail Header */}
      <div className="flex items-end justify-between mb-4 sm:mb-6 px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-cinema-text">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-cinema-muted mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {exploreLink && (
            <Link
              to={exploreLink}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-brand-violet hover:text-brand-pink transition-colors mr-2"
            >
              <span>{exploreLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-xl bg-cinema-surface border border-cinema-border text-cinema-text hover:bg-brand-violet/20 hover:border-brand-violet/40 transition-colors shadow-sm"
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-xl bg-cinema-surface border border-cinema-border text-cinema-text hover:bg-brand-violet/20 hover:border-brand-violet/40 transition-colors shadow-sm"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 px-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="w-[170px] sm:w-[210px] flex-shrink-0 relative"
            style={{ scrollSnapAlign: 'start' }}
          >
            {numbered && (
              <div className="absolute -top-3 -left-3 z-20 w-8 h-8 rounded-full bg-gradient-to-br from-brand-violet to-brand-pink text-white font-display font-black text-sm flex items-center justify-center shadow-cinema-glow border-2 border-cinema-bg">
                {index + 1}
              </div>
            )}
            <MovieCard
              movie={movie}
              layout="grid"
              index={index}
              onQuickView={setSelectedMovie}
            />
          </div>
        ))}
      </div>

      {/* Quick Details Modal */}
      <QuickDetailsModal
        movie={selectedMovie}
        isOpen={Boolean(selectedMovie)}
        onClose={() => setSelectedMovie(null)}
        onOpenTrailer={onOpenTrailer}
      />
    </section>
  );
};
