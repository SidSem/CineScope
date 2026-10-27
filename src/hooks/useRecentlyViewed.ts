import { useAppStore } from '../store/appStore';
import { MOVIES } from '../data/movies';
import { Movie } from '../types/movie';

export function useRecentlyViewed() {
  const recentlyViewed = useAppStore(state => state.recentlyViewed);
  const addRecentlyViewed = useAppStore(state => state.addRecentlyViewed);
  const clearRecentlyViewed = useAppStore(state => state.clearRecentlyViewed);

  const recentMovies: Movie[] = recentlyViewed
    .map(id => MOVIES.find(m => m.id === id))
    .filter((m): m is Movie => m !== undefined);

  return {
    recentIds: recentlyViewed,
    recentMovies,
    addRecentlyViewed,
    clearRecentlyViewed
  };
}
