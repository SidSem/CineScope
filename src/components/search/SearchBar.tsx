import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, Sparkles } from 'lucide-react';
import { MOVIES } from '../../data/movies';
import { useAppStore } from '../../store/appStore';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by title, director, actor, genre, or keyword...',
  autoFocus = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const recentSearches = useAppStore(state => state.recentSearches);
  const addRecentSearch = useAppStore(state => state.addRecentSearch);
  const clearRecentSearches = useAppStore(state => state.clearRecentSearches);

  // Generate dynamic suggestions based on typed input
  const suggestions = React.useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const matches: { text: string; category: string }[] = [];

    // Check movie titles
    MOVIES.forEach(m => {
      if (m.title.toLowerCase().includes(q) && !matches.some(x => x.text === m.title)) {
        matches.push({ text: m.title, category: 'Movie' });
      }
      if (m.director && m.director.toLowerCase().includes(q) && !matches.some(x => x.text === m.director)) {
        matches.push({ text: m.director, category: 'Director' });
      }
      if (m.genres.some(g => g.toLowerCase().includes(q))) {
        const matchingGenre = m.genres.find(g => g.toLowerCase().includes(q));
        if (matchingGenre && !matches.some(x => x.text === matchingGenre)) {
          matches.push({ text: matchingGenre, category: 'Genre' });
        }
      }
    });

    return matches.slice(0, 6);
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (query: string) => {
    onChange(query);
    addRecentSearch(query);
    setIsOpen(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = suggestions.length > 0 ? suggestions.length : recentSearches.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightIndex(prev => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      if (highlightIndex >= 0) {
        e.preventDefault();
        if (suggestions.length > 0) {
          handleSelect(suggestions[highlightIndex].text);
        } else if (recentSearches.length > 0) {
          handleSelect(recentSearches[highlightIndex]);
        }
      } else if (value.trim()) {
        addRecentSearch(value.trim());
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-cinema-muted pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-11 py-3.5 rounded-2xl bg-cinema-surface border border-cinema-border text-cinema-text placeholder-cinema-muted text-sm focus:outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/25 shadow-sm transition-all"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          role="combobox"
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-3.5 p-1 rounded-lg text-cinema-muted hover:text-cinema-text hover:bg-cinema-subtle transition-colors"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions / Recent Searches Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl cinema-glass border border-cinema-border shadow-2xl bg-cinema-surface z-40 max-h-80 overflow-y-auto">
          {suggestions.length > 0 ? (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-cinema-muted flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
                <span>Suggestions</span>
              </div>
              {suggestions.map((item, idx) => (
                <button
                  key={`${item.text}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(item.text)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm transition-colors ${
                    idx === highlightIndex
                      ? 'bg-brand-violet text-white font-medium'
                      : 'text-cinema-text hover:bg-cinema-subtle'
                  }`}
                >
                  <span className="truncate">{item.text}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      idx === highlightIndex ? 'bg-white/20 text-white' : 'bg-cinema-elevated text-cinema-muted'
                    }`}
                  >
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          ) : recentSearches.length > 0 && !value.trim() ? (
            <div>
              <div className="flex items-center justify-between px-3 py-1.5 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cinema-muted flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-tangerine" />
                  <span>Recent Searches</span>
                </span>
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-[11px] text-cinema-muted hover:text-brand-pink transition-colors font-semibold"
                >
                  Clear all
                </button>
              </div>

              {recentSearches.map((term, idx) => (
                <button
                  key={`${term}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(term)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm transition-colors ${
                    idx === highlightIndex
                      ? 'bg-brand-violet text-white font-medium'
                      : 'text-cinema-text hover:bg-cinema-subtle'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-cinema-muted flex-shrink-0" />
                  <span className="truncate">{term}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
