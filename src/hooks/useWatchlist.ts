import { useAppStore } from '../store/appStore';
import { MOVIES } from '../data/movies';
import { Movie } from '../types/movie';

export function useWatchlist() {
  const watchlist = useAppStore(state => state.watchlist);
  const watched = useAppStore(state => state.watched);
  const toggleWatchlist = useAppStore(state => state.toggleWatchlist);
  const toggleWatched = useAppStore(state => state.toggleWatched);
  const clearWatchlist = useAppStore(state => state.clearWatchlist);

  const watchlistMovies: Movie[] = watchlist
    .map(id => MOVIES.find(m => m.id === id))
    .filter((m): m is Movie => m !== undefined);

  const watchedMovies: Movie[] = watched
    .map(id => MOVIES.find(m => m.id === id))
    .filter((m): m is Movie => m !== undefined);

  const isSaved = (movieId: string) => watchlist.includes(movieId);
  const isWatched = (movieId: string) => watched.includes(movieId);

  return {
    watchlist,
    watched,
    watchlistMovies,
    watchedMovies,
    watchlistCount: watchlist.length,
    watchedCount: watched.length,
    isSaved,
    isWatched,
    toggleWatchlist,
    toggleWatched,
    clearWatchlist
  };
}
