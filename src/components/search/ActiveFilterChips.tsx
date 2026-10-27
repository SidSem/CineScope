import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { FilterState } from '../../types/movie';
import { MOODS } from '../../data/moods';

interface ActiveFilterChipsProps {
  filters: FilterState;
  onRemoveGenre: (genre: string) => void;
  onClearMood: () => void;
  onClearRating: () => void;
  onClearYear: () => void;
  onClearRuntime: () => void;
  onClearStatus: () => void;
  onClearQuery: () => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onRemoveGenre,
  onClearMood,
  onClearRating,
  onClearYear,
  onClearRuntime,
  onClearStatus,
  onClearQuery,
  onClearAll
}) => {
  const activeMood = filters.mood ? MOODS.find(m => m.id === filters.mood) : null;
  const hasActiveFilters =
    filters.query.trim().length > 0 ||
    filters.genres.length > 0 ||
    Boolean(filters.mood) ||
    (filters.minRating !== undefined && filters.minRating > 0) ||
    (filters.yearMin !== undefined && filters.yearMin > 1970) ||
    (filters.yearMax !== undefined && filters.yearMax < 2026) ||
    Boolean(filters.maxRuntime) ||
    filters.status !== 'all';

  if (!hasActiveFilters) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap my-4">
      <span className="text-xs font-semibold text-cinema-muted mr-1">
        Active Filters:
      </span>

      {filters.query && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-violet/15 text-brand-violet border border-brand-violet/30">
          <span>Search: &ldquo;{filters.query}&rdquo;</span>
          <button
            type="button"
            onClick={onClearQuery}
            className="hover:opacity-75 p-0.5 rounded-full"
            aria-label="Remove search query"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.genres.map(g => (
        <span
          key={g}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-pink/15 text-brand-pink border border-brand-pink/30"
        >
          <span>{g}</span>
          <button
            type="button"
            onClick={() => onRemoveGenre(g)}
            className="hover:opacity-75 p-0.5 rounded-full"
            aria-label={`Remove genre ${g}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {activeMood && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-sunshine/15 text-brand-sunshine border border-brand-sunshine/30">
          <span>Mood: {activeMood.name}</span>
          <button
            type="button"
            onClick={onClearMood}
            className="hover:opacity-75 p-0.5 rounded-full"
            aria-label="Remove mood filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.minRating && filters.minRating > 0 && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-aqua/15 text-brand-aqua border border-brand-aqua/30">
          <span>★ {filters.minRating.toFixed(1)}+</span>
          <button
            type="button"
            onClick={onClearRating}
            className="hover:opacity-75 p-0.5 rounded-full"
            aria-label="Remove rating filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.maxRuntime && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-tangerine/15 text-brand-tangerine border border-brand-tangerine/30">
          <span>Under {filters.maxRuntime}m</span>
          <button
            type="button"
            onClick={onClearRuntime}
            className="hover:opacity-75 p-0.5 rounded-full"
            aria-label="Remove runtime filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {(filters.yearMin || filters.yearMax) && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cinema-elevated text-cinema-text border border-cinema-border">
          <span>
            {filters.yearMin || '1970'} – {filters.yearMax || 'Present'}
          </span>
          <button
            type="button"
            onClick={onClearYear}
            className="hover:opacity-75 p-0.5 rounded-full"
            aria-label="Remove year filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {filters.status !== 'all' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-violet/20 text-brand-violet border border-brand-violet/40">
          <span className="capitalize">{filters.status}</span>
          <button
            type="button"
            onClick={onClearStatus}
            className="hover:opacity-75 p-0.5 rounded-full"
            aria-label="Remove status filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs font-semibold text-cinema-muted hover:text-brand-pink transition-colors px-2 py-1 ml-1"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reset all</span>
      </button>
    </div>
  );
};
