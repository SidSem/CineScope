import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, List } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { MovieGrid } from '../components/movie/MovieGrid';
import { SortControl } from '../components/search/SortControl';
import { EmptyState } from '../components/feedback/EmptyState';
import { GENRES } from '../data/genres';
import { movieService } from '../services/movieService';
import { SortOption } from '../types/movie';
import { filterAndSortMovies } from '../lib/movieFilters';
import { useAppStore } from '../store/appStore';

export const GenrePage: React.FC = () => {
  const { genre: genreParam } = useParams<{ genre: string }>();
  const [sortBy, setSortBy] = useState<SortOption>('popularity');

  const viewMode = useAppStore(state => state.preferences.viewMode);
  const setViewMode = useAppStore(state => state.setViewMode);
  const watchlist = useAppStore(state => state.watchlist);
  const watched = useAppStore(state => state.watched);

  const matchedGenre = GENRES.find(
    g => g.slug.toLowerCase() === genreParam?.toLowerCase() ||
         g.name.toLowerCase() === genreParam?.toLowerCase()
  );

  const rawMovies = genreParam ? movieService.getMoviesByGenre(genreParam) : [];

  const sortedMovies = useMemo(() => {
    return filterAndSortMovies(
      rawMovies,
      {
        query: '',
        genres: [],
        sortBy,
        status: 'all'
      },
      { watchlist, watched }
    );
  }, [rawMovies, sortBy, watchlist, watched]);

  if (!matchedGenre && rawMovies.length === 0) {
    return (
      <PageContainer maxWidth="md">
        <EmptyState
          title="Genre Not Found"
          description={`We could not locate any films classified under "${genreParam}".`}
          actionLabel="View All Genres"
          actionLink="/discover"
        />
      </PageContainer>
    );
  }

  const title = matchedGenre?.name || genreParam || 'Genre';
  const description = matchedGenre?.description || `Explore celebrated ${title} masterworks and audience favorites.`;

  return (
    <PageContainer maxWidth="7xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-cinema-muted hover:text-cinema-text hover:bg-cinema-subtle transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden cinema-glass border border-cinema-border p-6 sm:p-10 mb-8 bg-cinema-surface shadow-card-elevated">
        <div
          className={`absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-gradient-to-br ${
            matchedGenre?.gradient || 'from-brand-violet to-brand-pink'
          } opacity-20 blur-3xl pointer-events-none`}
        />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-violet/15 text-brand-violet border border-brand-violet/30 mb-2.5">
            Genre Spotlight
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-cinema-text tracking-tight mb-2">
            {title}
          </h1>

          <p className="text-sm text-cinema-muted leading-relaxed max-w-xl">
            {description}
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-cinema-border mb-6">
        <span className="text-xs sm:text-sm font-semibold text-cinema-muted">
          Showing <span className="text-cinema-text font-bold">{sortedMovies.length}</span> films
        </span>

        <div className="flex items-center gap-3">
          <SortControl
            value={sortBy}
            onChange={setSortBy}
            className="w-48 sm:w-60"
          />

          <div className="flex items-center rounded-xl bg-cinema-surface border border-cinema-border p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-brand-violet text-white shadow-sm'
                  : 'text-cinema-muted hover:text-cinema-text'
              }`}
              aria-label="Grid layout"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-brand-violet text-white shadow-sm'
                  : 'text-cinema-muted hover:text-cinema-text'
              }`}
              aria-label="List layout"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <MovieGrid movies={sortedMovies} layout={viewMode} />
    </PageContainer>
  );
};
