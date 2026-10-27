import { StoredUserData } from '../types/movie';

export const CURRENT_STORAGE_VERSION = 1;
export const STORAGE_KEY = 'cinescope_user_data_v1';

const DEFAULT_USER_DATA: StoredUserData = {
  version: CURRENT_STORAGE_VERSION,
  watchlist: ['cs-01', 'cs-04', 'cs-06'], // Friendly curated starter items
  watched: ['cs-11', 'cs-15'],
  recentlyViewed: ['cs-01', 'cs-02'],
  recentSearches: ['Odyssey', 'Cyberpunk', 'Animation'],
  preferences: {
    name: 'Cinephile',
    theme: 'dark',
    viewMode: 'grid',
    preferredGenres: ['Science Fiction', 'Animation', 'Drama']
  }
};

class MemoryStorage {
  private data: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.data[key] ?? null;
  }
  setItem(key: string, value: string): void {
    this.data[key] = value;
  }
  removeItem(key: string): void {
    delete this.data[key];
  }
}

const memoryFallback = new MemoryStorage();

function getStorageBackend(): Storage | MemoryStorage {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const testKey = '__cinescope_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch (err) {
    console.warn('[CineScope] localStorage unavailable or restricted. Falling back to in-memory store.', err);
  }
  return memoryFallback;
}

export function loadStoredUserData(): StoredUserData {
  const backend = getStorageBackend();
  try {
    const raw = backend.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_USER_DATA;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return DEFAULT_USER_DATA;
    }

    return {
      version: CURRENT_STORAGE_VERSION,
      watchlist: Array.isArray(parsed.watchlist) ? parsed.watchlist.filter(Boolean) : DEFAULT_USER_DATA.watchlist,
      watched: Array.isArray(parsed.watched) ? parsed.watched.filter(Boolean) : DEFAULT_USER_DATA.watched,
      recentlyViewed: Array.isArray(parsed.recentlyViewed) ? parsed.recentlyViewed.filter(Boolean) : [],
      recentSearches: Array.isArray(parsed.recentSearches) ? parsed.recentSearches.filter(Boolean) : [],
      preferences: {
        name: typeof parsed.preferences?.name === 'string' ? parsed.preferences.name : DEFAULT_USER_DATA.preferences.name,
        theme: parsed.preferences?.theme === 'light' ? 'light' : 'dark',
        viewMode: parsed.preferences?.viewMode === 'list' ? 'list' : 'grid',
        preferredGenres: Array.isArray(parsed.preferences?.preferredGenres) ? parsed.preferences.preferredGenres : DEFAULT_USER_DATA.preferences.preferredGenres
      }
    };
  } catch (err) {
    console.error('[CineScope] Error parsing stored user data, recovering default state.', err);
    return DEFAULT_USER_DATA;
  }
}

export function saveStoredUserData(data: StoredUserData): boolean {
  const backend = getStorageBackend();
  try {
    const payload = JSON.stringify({
      ...data,
      version: CURRENT_STORAGE_VERSION
    });
    backend.setItem(STORAGE_KEY, payload);
    return true;
  } catch (err) {
    console.error('[CineScope] Error saving to localStorage:', err);
    return false;
  }
}

export function clearStoredUserData(): void {
  const backend = getStorageBackend();
  try {
    backend.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('[CineScope] Error clearing stored data:', err);
  }
}
