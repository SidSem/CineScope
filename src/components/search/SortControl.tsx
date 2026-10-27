import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SortOption } from '../../types/movie';

interface SortControlProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  className?: string;
}

export const SortControl: React.FC<SortControlProps> = ({
  value,
  onChange,
  className = ''
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <ArrowUpDown className="absolute left-3 w-4 h-4 text-cinema-muted pointer-events-none" />
      <select
        value={value}
        onChange={e => onChange(e.target.value as SortOption)}
        className="w-full pl-9 pr-8 py-2 rounded-xl bg-cinema-surface border border-cinema-border text-cinema-text text-xs sm:text-sm font-semibold focus:outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet cursor-pointer appearance-none shadow-sm"
        aria-label="Sort movies by"
      >
        <option value="popularity">CineScope Picks (Featured First)</option>
        <option value="rating-desc">Rating: Highest First</option>
        <option value="year-desc">Release: Newest First</option>
        <option value="year-asc">Release: Oldest First</option>
        <option value="title-asc">Title: A to Z</option>
        <option value="title-desc">Title: Z to A</option>
        <option value="runtime-asc">Runtime: Shortest First</option>
      </select>
      <div className="absolute right-3 pointer-events-none text-cinema-muted text-xs">
        ▼
      </div>
    </div>
  );
};
