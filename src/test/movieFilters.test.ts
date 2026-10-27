import { describe, it, expect } from 'vitest';
import { filterAndSortMovies, normalizeText } from '../lib/movieFilters';
import { Movie, FilterState } from '../types/movie';

const mockMovies: Movie[] = [
  {
    id: 'test-1',
    slug: 'stellar-odyssey',
    title: 'Stellar Odyssey',
    year: 2023,
    genres: ['Science Fiction', 'Adventure'],
    overview: 'A deep space journey beyond the stars.',
    runtimeMinutes: 160,
    rating: 8.8,
    director: 'Elena Vance',
    cast: ['Alexander Thorne', 'Maya Lin'],
    tags: ['space-exploration', 'mind-bending']
  },
  {
    id: 'test-2',
    slug: 'neon-city-noir',
    title: 'Neon City Noir',
    year: 2020,
    genres: ['Crime', 'Thriller'],
    overview: 'A cyberpunk detective tracking synthetic operatives.',
    runtimeMinutes: 120,
    rating: 7.9,
    director: 'Lucian Moreau',
    cast: ['Jean-Pierre Valois'],
    tags: ['cyberpunk', 'atmospheric']
  },
  {
    id: 'test-3',
    slug: 'quiet-waters',
    title: 'Quiet Waters',
    year: 2018,
    genres: ['Drama'],
    overview: 'A contemplative portrait of coastal silence.',
    runtimeMinutes: 90,
    // Rating intentionally omitted to test missing-rating handling
    director: 'Anja Weiss',
    tags: ['cozy-night', 'peaceful']
  },
  {
    id: 'test-4',
    slug: 'action-protocol',
    title: 'Action Protocol',
    year: 2024,
    genres: ['Action', 'Thriller'],
    overview: 'High stakes adrenaline across modern rooftops.',
    runtimeMinutes: 110,
    rating: 8.1,
    director: 'Carlos Vega',
    tags: ['adrenaline', 'action-packed']
  }
];

const defaultFilters: FilterState = {
  query: '',
  genres: [],
  sortBy: 'popularity',
  status: 'all'
};

describe('Movie Filtering & Normalization', () => {
  it('normalizes text and strips diacritics', () => {
    expect(normalizeText('  ChrOnIquE dÉ Nuit  ')).toBe('chronique de nuit');
  });

  it('performs case-insensitive search by title', () => {
    const results = filterAndSortMovies(mockMovies, {
      ...defaultFilters,
      query: 'stellar'
    });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('test-1');
  });

  it('searches across director names', () => {
    const results = filterAndSortMovies(mockMovies, {
      ...defaultFilters,
      query: 'elena vance'
    });
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Stellar Odyssey');
  });

  it('searches across cast members', () => {
    const results = filterAndSortMovies(mockMovies, {
      ...defaultFilters,
      query: 'maya lin'
    });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('test-1');
  });

  it('searches across curated tags', () => {
    const results = filterAndSortMovies(mockMovies, {
      ...defaultFilters,
      query: 'cyberpunk'
    });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('test-2');
  });

  it('filters by genre correctly', () => {
    const results = filterAndSortMovies(mockMovies, {
      ...defaultFilters,
      genres: ['Thriller']
    });
    expect(results).toHaveLength(2);
    expect(results.map(r => r.id)).toEqual(['test-4', 'test-2']);
  });

  it('filters by year range', () => {
    const results = filterAndSortMovies(mockMovies, {
      ...defaultFilters,
      yearMin: 2021,
      yearMax: 2024
    });
    expect(results).toHaveLength(2);
    expect(results.map(r => r.year)).toEqual([2023, 2024]);
  });

  it('handles minimum rating gracefully without including unrated films', () => {
    const results = filterAndSortMovies(mockMovies, {
      ...defaultFilters,
      minRating: 8.0
    });
    expect(results).toHaveLength(2);
    expect(results.every(r => (r.rating || 0) >= 8.0)).toBe(true);
    // Unrated movie test-3 should be excluded
    expect(results.some(r => r.id === 'test-3')).toBe(false);
  });
});

describe('Movie Sorting Logic', () => {
  it('sorts title alphabetically A-Z and Z-A', () => {
    const asc = filterAndSortMovies(mockMovies, {
      ...defaultFilters,
      sortBy: 'title-asc'
    });
    expect(asc[0].title).toBe('Action Protocol');
    expect(asc[asc.length - 1].title).toBe('Stellar Odyssey');

    const desc = filterAndSortMovies(mockMovies, {
      ...defaultFilters,
      sortBy: 'title-desc'
    });
    expect(desc[0].title).toBe('Stellar Odyssey');
    expect(desc[desc.length - 1].title).toBe('Action Protocol');
  });

  it('sorts by release year newest first and oldest first', () => {
    const newest = filterAndSortMovies(mockMovies, {
      ...defaultFilters,
      sortBy: 'year-desc'
    });
    expect(newest[0].year).toBe(2024);

    const oldest = filterAndSortMovies(mockMovies, {
      ...defaultFilters,
      sortBy: 'year-asc'
    });
    expect(oldest[0].year).toBe(2018);
  });

  it('sorts by rating with missing ratings placed at the bottom', () => {
    const sorted = filterAndSortMovies(mockMovies, {
      ...defaultFilters,
      sortBy: 'rating-desc'
    });
    expect(sorted[0].rating).toBe(8.8);
    // Movie with undefined rating must be last, not first
    expect(sorted[sorted.length - 1].id).toBe('test-3');
    expect(sorted[sorted.length - 1].rating).toBeUndefined();
  });

  it('sorts by runtime shortest first', () => {
    const sorted = filterAndSortMovies(mockMovies, {
      ...defaultFilters,
      sortBy: 'runtime-asc'
    });
    expect(sorted[0].runtimeMinutes).toBe(90);
    expect(sorted[sorted.length - 1].runtimeMinutes).toBe(160);
  });
});
