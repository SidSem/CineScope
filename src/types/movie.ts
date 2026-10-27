export interface Movie {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  releaseDate?: string;
  year: number;
  genres: string[];
  overview: string;
  runtimeMinutes?: number;
  rating?: number;
  ratingSource?: string;
  posterUrl?: string;
  backdropUrl?: string;
  director?: string;
  cast?: string[];
  tags: string[];
  trailerUrl?: string;
  language?: string;
  budget?: string;
  revenue?: string;
  featured?: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage?: string;
  accentColor: string;
  movieIds: string[];
  icon: string;
}

export interface Mood {
  id: string;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
  matchingTags: string[];
  matchingGenres: string[];
}

export type SortOption =
  | 'popularity'
  | 'title-asc'
  | 'title-desc'
  | 'year-desc'
  | 'year-asc'
  | 'rating-desc'
  | 'runtime-asc';

export type StatusFilter = 'all' | 'watched' | 'unwatched' | 'watchlist';

export type ViewMode = 'grid' | 'list';

export interface FilterState {
  query: string;
  genres: string[];
  yearMin?: number;
  yearMax?: number;
  minRating?: number;
  maxRuntime?: number;
  mood?: string;
  status: StatusFilter;
  sortBy: SortOption;
}

export interface UserPreferences {
  name: string;
  theme: 'dark' | 'light';
  viewMode: ViewMode;
  preferredGenres: string[];
}

export interface StoredUserData {
  version: number;
  watchlist: string[];
  watched: string[];
  recentlyViewed: string[];
  recentSearches: string[];
  preferences: UserPreferences;
  exportedAt?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}
