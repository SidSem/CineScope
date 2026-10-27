import { create } from 'zustand';
import { StoredUserData, UserPreferences, ToastMessage } from '../types/movie';
import { loadStoredUserData, saveStoredUserData, clearStoredUserData } from '../lib/storage';

interface AppStoreState {
  watchlist: string[];
  watched: string[];
  recentlyViewed: string[];
  recentSearches: string[];
  preferences: UserPreferences;
  toasts: ToastMessage[];

  // Actions
  toggleWatchlist: (movieId: string, movieTitle?: string) => void;
  addToWatchlist: (movieId: string, movieTitle?: string) => void;
  removeFromWatchlist: (movieId: string, movieTitle?: string) => void;
  toggleWatched: (movieId: string, movieTitle?: string) => void;
  clearWatchlist: () => void;
  clearWatched: () => void;

  addRecentlyViewed: (movieId: string) => void;
  clearRecentlyViewed: () => void;

  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  setTheme: (theme: 'dark' | 'light') => void;
  setViewMode: (viewMode: 'grid' | 'list') => void;
  updatePreferences: (partial: Partial<UserPreferences>) => void;

  importUserData: (data: StoredUserData) => void;
  resetAllData: () => void;

  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const initialData = loadStoredUserData();

// Sync initial theme with DOM
if (typeof document !== 'undefined') {
  if (initialData.preferences.theme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  watchlist: initialData.watchlist,
  watched: initialData.watched,
  recentlyViewed: initialData.recentlyViewed,
  recentSearches: initialData.recentSearches,
  preferences: initialData.preferences,
  toasts: [],

  toggleWatchlist: (movieId, movieTitle) => {
    const { watchlist, addToast } = get();
    const exists = watchlist.includes(movieId);
    const updated = exists
      ? watchlist.filter(id => id !== movieId)
      : [movieId, ...watchlist];

    set({ watchlist: updated });
    saveStoredUserData({
      ...get(),
      version: 1
    });

    if (exists) {
      addToast(
        'Removed from Watchlist',
        movieTitle ? `"${movieTitle}" was removed.` : undefined,
        'info'
      );
    } else {
      addToast(
        'Added to Watchlist!',
        movieTitle ? `"${movieTitle}" is saved for later.` : undefined,
        'success'
      );
    }
  },

  addToWatchlist: (movieId, movieTitle) => {
    const { watchlist, addToast } = get();
    if (!watchlist.includes(movieId)) {
      const updated = [movieId, ...watchlist];
      set({ watchlist: updated });
      saveStoredUserData({ ...get(), version: 1 });
      addToast('Added to Watchlist!', movieTitle ? `"${movieTitle}" is saved.` : undefined, 'success');
    }
  },

  removeFromWatchlist: (movieId, movieTitle) => {
    const { watchlist, addToast } = get();
    if (watchlist.includes(movieId)) {
      const updated = watchlist.filter(id => id !== movieId);
      set({ watchlist: updated });
      saveStoredUserData({ ...get(), version: 1 });
      addToast('Removed from Watchlist', movieTitle ? `"${movieTitle}" removed.` : undefined, 'info');
    }
  },

  toggleWatched: (movieId, movieTitle) => {
    const { watched, addToast } = get();
    const isWatched = watched.includes(movieId);
    const updated = isWatched
      ? watched.filter(id => id !== movieId)
      : [movieId, ...watched];

    set({ watched: updated });
    saveStoredUserData({ ...get(), version: 1 });

    if (isWatched) {
      addToast('Marked as Unwatched', movieTitle ? `"${movieTitle}"` : undefined, 'info');
    } else {
      addToast('Marked as Watched!', movieTitle ? `Added "${movieTitle}" to your viewing history.` : undefined, 'success');
    }
  },

  clearWatchlist: () => {
    set({ watchlist: [] });
    saveStoredUserData({ ...get(), version: 1 });
    get().addToast('Watchlist Cleared', 'All saved movies were removed.', 'info');
  },

  clearWatched: () => {
    set({ watched: [] });
    saveStoredUserData({ ...get(), version: 1 });
    get().addToast('History Cleared', 'Viewing records were cleared.', 'info');
  },

  addRecentlyViewed: (movieId) => {
    const { recentlyViewed } = get();
    const filtered = recentlyViewed.filter(id => id !== movieId);
    const updated = [movieId, ...filtered].slice(0, 15);
    set({ recentlyViewed: updated });
    saveStoredUserData({ ...get(), version: 1 });
  },

  clearRecentlyViewed: () => {
    set({ recentlyViewed: [] });
    saveStoredUserData({ ...get(), version: 1 });
    get().addToast('Recent History Cleared', undefined, 'info');
  },

  addRecentSearch: (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const { recentSearches } = get();
    const filtered = recentSearches.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...filtered].slice(0, 10);
    set({ recentSearches: updated });
    saveStoredUserData({ ...get(), version: 1 });
  },

  clearRecentSearches: () => {
    set({ recentSearches: [] });
    saveStoredUserData({ ...get(), version: 1 });
  },

  setTheme: (theme) => {
    if (typeof document !== 'undefined') {
      if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    }
    const preferences = { ...get().preferences, theme };
    set({ preferences });
    saveStoredUserData({ ...get(), preferences, version: 1 });
  },

  setViewMode: (viewMode) => {
    const preferences = { ...get().preferences, viewMode };
    set({ preferences });
    saveStoredUserData({ ...get(), preferences, version: 1 });
  },

  updatePreferences: (partial) => {
    const preferences = { ...get().preferences, ...partial };
    set({ preferences });
    saveStoredUserData({ ...get(), preferences, version: 1 });
    get().addToast('Preferences Updated', undefined, 'success');
  },

  importUserData: (data) => {
    set({
      watchlist: data.watchlist,
      watched: data.watched,
      recentlyViewed: data.recentlyViewed,
      recentSearches: data.recentSearches,
      preferences: data.preferences
    });
    saveStoredUserData(data);

    if (typeof document !== 'undefined') {
      if (data.preferences.theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    }

    get().addToast('Data Imported Successfully!', 'Your saved movies and settings have been restored.', 'success');
  },

  resetAllData: () => {
    clearStoredUserData();
    const resetState = loadStoredUserData();
    set({
      watchlist: [],
      watched: [],
      recentlyViewed: [],
      recentSearches: [],
      preferences: {
        name: 'Cinephile',
        theme: 'dark',
        viewMode: 'grid',
        preferredGenres: []
      }
    });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    get().addToast('All CineScope Data Reset', 'Storage cleared back to clean slate.', 'info');
  },

  addToast: (title, description, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { id, title, description, type };
    set(state => ({
      toasts: [...state.toasts.slice(-4), newToast]
    }));

    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }));
  }
}));
