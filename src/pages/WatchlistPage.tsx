import React, { useState, useMemo } from 'react';
import { Bookmark, CheckCircle2, Trash2, Search, Film } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { MovieGrid } from '../components/movie/MovieGrid';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { EmptyState } from '../components/feedback/EmptyState';
import { useWatchlist } from '../hooks/useWatchlist';
import { SortOption } from '../types/movie';
import { filterAndSortMovies } from '../lib/movieFilters';

export const WatchlistPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'history'>('watchlist');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  const {
    watchlist,
    watched,
    watchlistMovies,
    watchedMovies,
    clearWatchlist
  } = useWatchlist();

  const activeMovies = activeTab === 'watchlist' ? watchlistMovies : watchedMovies;

  // Extract unique genres present within the user's saved list
  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    activeMovies.forEach(m => m.genres.forEach(g => set.add(g)));
    return Array.from(set).sort();
  }, [activeMovies]);

  // Filter & sort the user's saved items
  const displayedMovies = useMemo(() => {
    return filterAndSortMovies(
      activeMovies,
      {
        query: searchQuery,
        genres: selectedGenre !== 'all' ? [selectedGenre] : [],
        sortBy,
        status: 'all'
      },
      { watchlist, watched }
    );
  }, [activeMovies, searchQuery, selectedGenre, sortBy, watchlist, watched]);

  const handleClear = () => {
    clearWatchlist();
    setIsConfirmClearOpen(false);
  };

  return (
    <PageContainer maxWidth="7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-cinema-text">
            My Cinema Vault
          </h1>
          <p className="text-sm text-cinema-muted mt-1">
            Organize your bookmarks, plan upcoming film sessions, and review your watched log.
          </p>
        </div>

        {activeTab === 'watchlist' && watchlistMovies.length > 0 && (
          <button
            type="button"
            onClick={() => setIsConfirmClearOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-cinema-muted hover:text-red-400 border border-cinema-border hover:border-red-400/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Watchlist</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cinema-border mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab('watchlist');
            setSelectedGenre('all');
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'watchlist'
              ? 'border-brand-violet text-brand-violet'
              : 'border-transparent text-cinema-muted hover:text-cinema-text'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>My Watchlist</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-brand-violet/15 text-brand-violet">
            {watchlistMovies.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('history');
            setSelectedGenre('all');
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'history'
              ? 'border-brand-aqua text-brand-aqua'
              : 'border-transparent text-cinema-muted hover:text-cinema-text'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Watched History</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-brand-aqua/15 text-brand-aqua">
            {watchedMovies.length}
          </span>
        </button>
      </div>

      {/* Search & Filter within saved list */}
      {activeMovies.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          {/* Quick search input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cinema-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter saved films by title..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-cinema-surface border border-cinema-border text-xs text-cinema-text placeholder-cinema-muted focus:outline-none focus:border-brand-violet"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Genre selector */}
            {availableGenres.length > 0 && (
              <select
                value={selectedGenre}
                onChange={e => setSelectedGenre(e.target.value)}
                className="px-3 py-2 rounded-xl bg-cinema-surface border border-cinema-border text-xs text-cinema-text font-semibold focus:outline-none focus:border-brand-violet cursor-pointer"
              >
                <option value="all">All Genres</option>
                {availableGenres.map(g => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            )}

            {/* Sort selector */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-xl bg-cinema-surface border border-cinema-border text-xs text-cinema-text font-semibold focus:outline-none focus:border-brand-violet cursor-pointer"
            >
              <option value="popularity">Sort: Default</option>
              <option value="rating-desc">Sort: Highest Rating</option>
              <option value="year-desc">Sort: Newest First</option>
              <option value="title-asc">Sort: Title A-Z</option>
            </select>
          </div>
        </div>
      )}

      {/* Movies Grid or Empty State */}
      {activeMovies.length === 0 ? (
        <EmptyState
          title={activeTab === 'watchlist' ? 'Your Watchlist is Empty' : 'No Watched Records Yet'}
          description={
            activeTab === 'watchlist'
              ? 'You haven’t bookmarked any films yet. Browse our deep catalog or explore curated collections to save movies for your next movie night.'
              : 'As you discover and watch films, mark them as watched to track your cinematic viewing diary and unlock personalized stats.'
          }
          actionLabel="Explore Catalog"
          actionLink="/discover"
          icon={Film}
        />
      ) : displayedMovies.length === 0 ? (
        <EmptyState
          title="No matching saved films"
          description="None of your saved movies matched your current search or genre filter."
          actionLabel="Clear Filter"
          onAction={() => {
            setSearchQuery('');
            setSelectedGenre('all');
          }}
          icon={Search}
        />
      ) : (
        <MovieGrid movies={displayedMovies} layout="grid" />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmClearOpen}
        title="Clear Entire Watchlist?"
        message="This action will remove all saved movies from your local watchlist. This cannot be undone."
        confirmLabel="Yes, Clear All"
        cancelLabel="Keep Movies"
        isDestructive={true}
        onConfirm={handleClear}
        onCancel={() => setIsConfirmClearOpen(false)}
      />
    </PageContainer>
  );
};
