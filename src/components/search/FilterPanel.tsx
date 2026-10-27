import React from 'react';
import { Filter, RotateCcw, Star, Clock, Calendar, Sparkles } from 'lucide-react';
import { FilterState, StatusFilter } from '../../types/movie';
import { GENRE_NAMES } from '../../data/genres';
import { MOODS } from '../../data/moods';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  className = ''
}) => {
  const toggleGenre = (genre: string) => {
    const exists = filters.genres.includes(genre);
    const updated = exists
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    onChange({ genres: updated });
  };

  const handleMoodSelect = (moodId: string) => {
    onChange({ mood: filters.mood === moodId ? undefined : moodId });
  };

  return (
    <aside
      className={`p-5 rounded-3xl bg-cinema-surface border border-cinema-border shadow-card-elevated ${className}`}
      aria-label="Movie Filters"
    >
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-cinema-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-violet" />
          <h2 className="text-base font-bold font-display text-cinema-text">
            Filters
          </h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-cinema-muted hover:text-brand-pink transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Viewing Status */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-cinema-muted mb-2.5 block">
            Status
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {(['all', 'watchlist', 'watched', 'unwatched'] as StatusFilter[]).map(status => (
              <button
                key={status}
                type="button"
                onClick={() => onChange({ status })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filters.status === status
                    ? 'bg-brand-violet text-white shadow-cinema-glow'
                    : 'bg-cinema-elevated text-cinema-muted hover:text-cinema-text border border-cinema-border'
                }`}
              >
                {status === 'all' ? 'All Movies' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Mood Discovery */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-cinema-muted mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-sunshine" />
              Pick Your Mood
            </span>
            {filters.mood && (
              <button
                type="button"
                onClick={() => onChange({ mood: undefined })}
                className="text-[10px] text-brand-pink hover:underline"
              >
                Clear
              </button>
            )}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {MOODS.map(m => {
              const isSelected = filters.mood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleMoodSelect(m.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-brand-sunshine text-stone-950 font-bold shadow-sm'
                      : 'bg-cinema-elevated text-cinema-muted hover:text-cinema-text border border-cinema-border'
                  }`}
                  title={m.description}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Genres */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-cinema-muted">
              Genres
            </label>
            {filters.genres.length > 0 && (
              <button
                type="button"
                onClick={() => onChange({ genres: [] })}
                className="text-[10px] text-brand-pink hover:underline"
              >
                Clear ({filters.genres.length})
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
            {GENRE_NAMES.map(genre => {
              const active = filters.genres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-brand-violet text-white shadow-cinema-glow font-semibold'
                      : 'bg-cinema-elevated text-cinema-muted hover:text-cinema-text border border-cinema-border'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimum Rating */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-cinema-muted flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-brand-sunshine" />
              Minimum Rating
            </label>
            <span className="text-xs font-bold text-brand-sunshine">
              {filters.minRating && filters.minRating > 0
                ? `${filters.minRating.toFixed(1)} / 10`
                : 'Any'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="9.0"
            step="0.5"
            value={filters.minRating || 0}
            onChange={e => onChange({ minRating: parseFloat(e.target.value) || undefined })}
            className="w-full accent-brand-violet cursor-pointer h-1.5 rounded-lg bg-cinema-elevated"
            aria-label="Filter by minimum movie rating"
          />
          <div className="flex justify-between text-[10px] text-cinema-muted mt-1 font-mono">
            <span>Any</span>
            <span>7.0</span>
            <span>8.0</span>
            <span>9.0+</span>
          </div>
        </div>

        {/* Maximum Runtime */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-cinema-muted flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-aqua" />
              Max Runtime
            </label>
            <span className="text-xs font-bold text-brand-aqua">
              {filters.maxRuntime ? `< ${filters.maxRuntime} mins` : 'Any'}
            </span>
          </div>
          <input
            type="range"
            min="80"
            max="180"
            step="10"
            value={filters.maxRuntime || 180}
            onChange={e => {
              const val = parseInt(e.target.value);
              onChange({ maxRuntime: val >= 180 ? undefined : val });
            }}
            className="w-full accent-brand-aqua cursor-pointer h-1.5 rounded-lg bg-cinema-elevated"
            aria-label="Filter by maximum runtime in minutes"
          />
          <div className="flex justify-between text-[10px] text-cinema-muted mt-1 font-mono">
            <span>80m</span>
            <span>100m</span>
            <span>140m</span>
            <span>Any</span>
          </div>
        </div>

        {/* Year Range */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-cinema-muted mb-2.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-tangerine" />
            Release Year
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-cinema-muted block mb-1">From</span>
              <input
                type="number"
                min="1970"
                max="2026"
                placeholder="1970"
                value={filters.yearMin || ''}
                onChange={e => onChange({ yearMin: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-cinema-elevated border border-cinema-border text-xs text-cinema-text focus:outline-none focus:border-brand-violet"
              />
            </div>
            <div>
              <span className="text-[10px] text-cinema-muted block mb-1">To</span>
              <input
                type="number"
                min="1970"
                max="2026"
                placeholder="2026"
                value={filters.yearMax || ''}
                onChange={e => onChange({ yearMax: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-cinema-elevated border border-cinema-border text-xs text-cinema-text focus:outline-none focus:border-brand-violet"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
