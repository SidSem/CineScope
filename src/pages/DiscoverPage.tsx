import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal, ArrowDownCircle } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { SearchBar } from '../components/search/SearchBar';
import { SortControl } from '../components/search/SortControl';
import { FilterPanel } from '../components/search/FilterPanel';
import { FilterDrawer } from '../components/search/FilterDrawer';
import { ActiveFilterChips } from '../components/search/ActiveFilterChips';
import { MovieGrid } from '../components/movie/MovieGrid';
import { TrailerModal } from '../components/movie/TrailerModal';
import { FilterState, SortOption, StatusFilter } from '../types/movie';
import { movieService } from '../services/movieService';
import { useAppStore } from '../store/appStore';

const PAGE_SIZE = 12;

export const DiscoverPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [activeTrailerUrl, setActiveTrailerUrl] = useState<string | null>(null);

  // User State & preferences
  const watchlist = useAppStore(state => state.watchlist);
  const watched = useAppStore(state => state.watched);
  const viewMode = useAppStore(state => state.preferences.viewMode);
  const setViewMode = useAppStore(state => state.setViewMode);

  // Initialize filters from URL parameters
  const initialFilters: FilterState = useMemo(() => {
    const q = searchParams.get('q') || '';
    const genres = searchParams.getAll('genre');
    const mood = searchParams.get('mood') || undefined;
    const sort = (searchParams.get('sort') as SortOption) || 'popularity';
    const status = (searchParams.get('status') as StatusFilter) || 'all';
    const minRating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined;
    const maxRuntime = searchParams.get('runtime') ? parseInt(searchParams.get('runtime')!) : undefined;
    const yearMin = searchParams.get('yearMin') ? parseInt(searchParams.get('yearMin')!) : undefined;
    const yearMax = searchParams.get('yearMax') ? parseInt(searchParams.get('yearMax')!) : undefined;

    return {
      query: q,
      genres,
      mood,
      sortBy: sort,
      status,
      minRating,
      maxRuntime,
      yearMin,
      yearMax
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Sync state back to URL parameters
  const syncUrlParams = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();
    if (newFilters.query.trim()) params.set('q', newFilters.query.trim());
    newFilters.genres.forEach(g => params.append('genre', g));
    if (newFilters.mood) params.set('mood', newFilters.mood);
    if (newFilters.sortBy && newFilters.sortBy !== 'popularity') params.set('sort', newFilters.sortBy);
    if (newFilters.status && newFilters.status !== 'all') params.set('status', newFilters.status);
    if (newFilters.minRating) params.set('rating', newFilters.minRating.toString());
    if (newFilters.maxRuntime) params.set('runtime', newFilters.maxRuntime.toString());
    if (newFilters.yearMin) params.set('yearMin', newFilters.yearMin.toString());
    if (newFilters.yearMax) params.set('yearMax', newFilters.yearMax.toString());

    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  const handleFilterChange = (partial: Partial<FilterState>) => {
    const updated = { ...filters, ...partial };
    setFilters(updated);
    syncUrlParams(updated);
    setVisibleCount(PAGE_SIZE); // reset pagination when filters change
  };

  const handleResetFilters = () => {
    const reset: FilterState = {
      query: '',
      genres: [],
      mood: undefined,
      sortBy: 'popularity',
      status: 'all',
      minRating: undefined,
      maxRuntime: undefined,
      yearMin: undefined,
      yearMax: undefined
    };
    setFilters(reset);
    syncUrlParams(reset);
    setVisibleCount(PAGE_SIZE);
  };

  // Perform search and filtering via pure service
  const filteredMovies = useMemo(() => {
    return movieService.filterMovies(filters, { watchlist, watched });
  }, [filters, watchlist, watched]);

  const displayedMovies = useMemo(() => {
    return filteredMovies.slice(0, visibleCount);
  }, [filteredMovies, visibleCount]);

  const hasMore = visibleCount < filteredMovies.length;

  return (
    <PageContainer maxWidth="7xl">
      {/* Top Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-cinema-text">
          Discover Catalog
        </h1>
        <p className="text-sm text-cinema-muted mt-1 max-w-xl">
          Search over deep titles, apply multi-genre filters, or uncover hidden gems across eras and styles.
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={filters.query}
          onChange={query => handleFilterChange({ query })}
          placeholder="Search by title, director, actor, genre, or keyword..."
        />
      </div>

      {/* Controls Bar: Results count, Active filter chips, Sort, View mode, Mobile filter button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-cinema-border mb-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cinema-surface border border-cinema-border text-cinema-text text-xs font-semibold hover:border-brand-violet"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-violet" />
            <span>Filters</span>
            {(filters.genres.length > 0 || filters.mood || filters.minRating || filters.status !== 'all') && (
              <span className="w-2 h-2 rounded-full bg-brand-pink" />
            )}
          </button>

          <span className="text-xs sm:text-sm font-semibold text-cinema-muted">
            Found <span className="text-cinema-text font-bold">{filteredMovies.length}</span> films
          </span>
        </div>

        <div className="flex items-center gap-3">
          <SortControl
            value={filters.sortBy}
            onChange={sortBy => handleFilterChange({ sortBy })}
            className="flex-1 sm:w-64"
          />

          {/* View Mode Toggle */}
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
              title="Poster Grid"
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
              title="Compact List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      <ActiveFilterChips
        filters={filters}
        onRemoveGenre={genre => {
          handleFilterChange({
            genres: filters.genres.filter(g => g !== genre)
          });
        }}
        onClearMood={() => handleFilterChange({ mood: undefined })}
        onClearRating={() => handleFilterChange({ minRating: undefined })}
        onClearYear={() => handleFilterChange({ yearMin: undefined, yearMax: undefined })}
        onClearRuntime={() => handleFilterChange({ maxRuntime: undefined })}
        onClearStatus={() => handleFilterChange({ status: 'all' })}
        onClearQuery={() => handleFilterChange({ query: '' })}
        onClearAll={handleResetFilters}
      />

      {/* Two Column Layout: Desktop Filter Sidebar + Main Movie Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Panel */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Movie Grid & Pagination */}
        <div className="lg:col-span-3">
          <MovieGrid
            movies={displayedMovies}
            layout={viewMode}
            emptyTitle="No movies match your criteria"
            emptyDescription="We couldn't find any films matching the selected filters. Try broadening your criteria or resetting."
            emptyActionLabel="Clear All Filters"
            onEmptyAction={handleResetFilters}
            onOpenTrailer={url => setActiveTrailerUrl(url || null)}
          />

          {/* Load More Pagination */}
          {hasMore && (
            <div className="flex flex-col items-center justify-center mt-12 mb-8">
              <button
                type="button"
                onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-cinema-surface hover:bg-brand-violet hover:text-white border border-cinema-border hover:border-brand-violet shadow-card-elevated transition-all active:scale-95"
              >
                <ArrowDownCircle className="w-4 h-4" />
                <span>
                  Load More Films ({filteredMovies.length - visibleCount} remaining)
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={filteredMovies.length}
      />

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={Boolean(activeTrailerUrl)}
        onClose={() => setActiveTrailerUrl(null)}
        movieTitle="Featured Film"
        trailerUrl={activeTrailerUrl || undefined}
      />
    </PageContainer>
  );
};
