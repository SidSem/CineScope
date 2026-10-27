import { Movie, FilterState } from '../types/movie';
import { MOVIES } from '../data/movies';
import { COLLECTIONS } from '../data/collections';
import { filterAndSortMovies } from '../lib/movieFilters';

/**
 * Movie service handling local dataset retrieval and optional TMDB client fallback.
 * NOTE: Any VITE_TMDB_API_KEY provided is bundled client-side and public.
 * CineScope runs 100% offline-ready and standalone without any API key.
 */

export const movieService = {
  getAllMovies(): Movie[] {
    return MOVIES;
  },

  getMovieById(idOrSlug: string): Movie | undefined {
    return MOVIES.find(m => m.id === idOrSlug || m.slug === idOrSlug);
  },

  getFeaturedMovies(): Movie[] {
    const featured = MOVIES.filter(m => m.featured);
    return featured.length > 0 ? featured : MOVIES.slice(0, 5);
  },

  getTrendingMovies(): Movie[] {
    // Top rated & recent releases
    return [...MOVIES]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);
  },

  getPopularPicks(): Movie[] {
    return MOVIES.filter(m => (m.rating || 0) >= 8.2).slice(0, 10);
  },

  getMoviesByGenre(genreName: string): Movie[] {
    const norm = genreName.toLowerCase().replace('-', ' ');
    return MOVIES.filter(m =>
      m.genres.some(g => g.toLowerCase() === norm || g.toLowerCase().replace(/\s+/g, '-') === genreName.toLowerCase())
    );
  },

  getMoviesByCollection(collectionSlug: string): Movie[] {
    const collection = COLLECTIONS.find(c => c.slug === collectionSlug || c.id === collectionSlug);
    if (!collection) return [];
    return collection.movieIds
      .map(id => MOVIES.find(m => m.id === id))
      .filter((m): m is Movie => m !== undefined);
  },

  filterMovies(
    filters: FilterState,
    userState?: { watchlist: string[]; watched: string[] }
  ): Movie[] {
    return filterAndSortMovies(MOVIES, filters, userState);
  }
};
