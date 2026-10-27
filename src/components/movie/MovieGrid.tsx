import React, { useState } from 'react';
import { Movie } from '../../types/movie';
import { MovieCard } from './MovieCard';
import { QuickDetailsModal } from './QuickDetailsModal';
import { EmptyState } from '../feedback/EmptyState';
import { Film } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  layout?: 'grid' | 'list';
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  emptyActionLink?: string;
  onEmptyAction?: () => void;
  onOpenTrailer?: (trailerUrl?: string) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  layout = 'grid',
  emptyTitle = 'No movies found',
  emptyDescription = 'Try adjusting your search criteria or clearing filters to discover other films.',
  emptyActionLabel,
  emptyActionLink,
  onEmptyAction,
  onOpenTrailer
}) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  if (movies.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        actionLink={emptyActionLink}
        onAction={onEmptyAction}
        icon={Film}
      />
    );
  }

  return (
    <>
      {layout === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              layout="grid"
              index={index}
              onQuickView={setSelectedMovie}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              layout="list"
              index={index}
              onQuickView={setSelectedMovie}
            />
          ))}
        </div>
      )}

      {/* Quick Details Modal */}
      <QuickDetailsModal
        movie={selectedMovie}
        isOpen={Boolean(selectedMovie)}
        onClose={() => setSelectedMovie(null)}
        onOpenTrailer={onOpenTrailer}
      />
    </>
  );
};
