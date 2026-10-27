import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clapperboard, LayoutGrid, List } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { MovieGrid } from '../components/movie/MovieGrid';
import { SortControl } from '../components/search/SortControl';
import { EmptyState } from '../components/feedback/EmptyState';
import { COLLECTIONS } from '../data/collections';
import { movieService } from '../services/movieService';
import { SortOption } from '../types/movie';
import { filterAndSortMovies } from '../lib/movieFilters';
import { useAppStore } from '../store/appStore';

export const CollectionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState<SortOption>('popularity');

  const viewMode = useAppStore(state => state.preferences.viewMode);
  const setViewMode = useAppStore(state => state.setViewMode);
  const watchlist = useAppStore(state => state.watchlist);
  const watched = useAppStore(state => state.watched);

  const collection = COLLECTIONS.find(c => c.slug === slug || c.id === slug);
  const rawMovies = collection ? movieService.getMoviesByCollection(collection.slug) : [];

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

  if (!collection) {
    return (
      <PageContainer maxWidth="md">
        <EmptyState
          title="Collection Not Found"
          description={`We could not locate the collection "${slug}".`}
          actionLabel="View All Collections"
          actionLink="/collections"
          icon={Clapperboard}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="7xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-cinema-muted hover:text-cinema-text hover:bg-cinema-subtle transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Collections</span>
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden cinema-glass border border-cinema-border shadow-2xl p-6 sm:p-10 mb-8 flex flex-col justify-end min-h-[240px] sm:min-h-[280px]">
        {collection.coverImage && (
          <img
            src={collection.coverImage}
            alt={collection.title}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/75 to-transparent" />

        <div className="relative z-10 max-w-2xl">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2 shadow-sm"
            style={{ backgroundColor: collection.accentColor }}
          >
            {collection.movieIds.length} Curated Films
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-tight mb-2">
            {collection.title}
          </h1>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl">
            {collection.description}
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
