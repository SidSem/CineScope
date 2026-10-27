import { Movie, FilterState } from '../types/movie';
import { MOODS } from '../data/moods';

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function filterAndSortMovies(
  movies: Movie[],
  filters: FilterState,
  userState?: {
    watchlist: string[];
    watched: string[];
  }
): Movie[] {
  const normQuery = normalizeText(filters.query);

  let results = movies.filter(movie => {
    // 1. Text Search query
    if (normQuery) {
      const matchTitle = normalizeText(movie.title).includes(normQuery);
      const matchOriginal = movie.originalTitle ? normalizeText(movie.originalTitle).includes(normQuery) : false;
      const matchDirector = movie.director ? normalizeText(movie.director).includes(normQuery) : false;
      const matchOverview = normalizeText(movie.overview).includes(normQuery);
      const matchGenres = movie.genres.some(g => normalizeText(g).includes(normQuery));
      const matchCast = movie.cast ? movie.cast.some(c => normalizeText(c).includes(normQuery)) : false;
      const matchTags = movie.tags.some(t => normalizeText(t).includes(normQuery));

      if (!matchTitle && !matchOriginal && !matchDirector && !matchOverview && !matchGenres && !matchCast && !matchTags) {
        return false;
      }
    }

    // 2. Genres filter (all selected must match)
    if (filters.genres.length > 0) {
      const hasAllGenres = filters.genres.every(selectedGenre =>
        movie.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase())
      );
      if (!hasAllGenres) return false;
    }

    // 3. Year range
    if (filters.yearMin !== undefined && movie.year < filters.yearMin) {
      return false;
    }
    if (filters.yearMax !== undefined && movie.year > filters.yearMax) {
      return false;
    }

    // 4. Minimum Rating (movies with missing rating are excluded if minRating > 0)
    if (filters.minRating !== undefined && filters.minRating > 0) {
      if (movie.rating === undefined || movie.rating < filters.minRating) {
        return false;
      }
    }

    // 5. Max Runtime
    if (filters.maxRuntime !== undefined && filters.maxRuntime > 0) {
      if (!movie.runtimeMinutes || movie.runtimeMinutes > filters.maxRuntime) {
        return false;
      }
    }

    // 6. Mood filter
    if (filters.mood) {
      const selectedMood = MOODS.find(m => m.id === filters.mood);
      if (selectedMood) {
        const matchesTag = movie.tags.some(tag =>
          selectedMood.matchingTags.includes(tag.toLowerCase())
        );
        const matchesGenre = movie.genres.some(genre =>
          selectedMood.matchingGenres.includes(genre)
        );
        if (!matchesTag && !matchesGenre) {
          return false;
        }
      }
    }

    // 7. Status filter
    if (filters.status !== 'all' && userState) {
      const isWatched = userState.watched.includes(movie.id);
      const isWatchlist = userState.watchlist.includes(movie.id);

      if (filters.status === 'watched' && !isWatched) return false;
      if (filters.status === 'unwatched' && isWatched) return false;
      if (filters.status === 'watchlist' && !isWatchlist) return false;
    }

    return true;
  });

  // Sorting
  results = [...results].sort((a, b) => {
    switch (filters.sortBy) {
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'year-desc':
        return (b.year || 0) - (a.year || 0);
      case 'year-asc':
        return (a.year || 0) - (b.year || 0);
      case 'rating-desc': {
        // Missing ratings sort to bottom
        const rA = a.rating !== undefined ? a.rating : -1;
        const rB = b.rating !== undefined ? b.rating : -1;
        return rB - rA;
      }
      case 'runtime-asc': {
        const tA = a.runtimeMinutes !== undefined ? a.runtimeMinutes : 99999;
        const tB = b.runtimeMinutes !== undefined ? b.runtimeMinutes : 99999;
        return tA - tB;
      }
      case 'popularity':
      default: {
        // Prioritize featured, then higher rating, then newer release
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        const rA = a.rating || 0;
        const rB = b.rating || 0;
        if (rB !== rA) return rB - rA;
        return (b.year || 0) - (a.year || 0);
      }
    }
  });

  return results;
}
