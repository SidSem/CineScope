import { describe, it, expect, beforeEach } from 'vitest';
import { loadStoredUserData, saveStoredUserData, clearStoredUserData, STORAGE_KEY } from '../lib/storage';

describe('Storage Persistence & Graceful Recovery', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default structured state when storage is empty', () => {
    const data = loadStoredUserData();
    expect(data).toBeDefined();
    expect(data.version).toBe(1);
    expect(Array.isArray(data.watchlist)).toBe(true);
    expect(Array.isArray(data.watched)).toBe(true);
    expect(data.preferences.theme).toBe('dark');
  });

  it('saves and reloads user state successfully', () => {
    const customData = {
      version: 1,
      watchlist: ['cs-01', 'cs-05'],
      watched: ['cs-02'],
      recentlyViewed: ['cs-01'],
      recentSearches: ['Odyssey'],
      preferences: {
        name: 'FilmGeek',
        theme: 'light' as const,
        viewMode: 'list' as const,
        preferredGenres: ['Action', 'Thriller']
      }
    };

    const saved = saveStoredUserData(customData);
    expect(saved).toBe(true);

    const loaded = loadStoredUserData();
    expect(loaded.watchlist).toEqual(['cs-01', 'cs-05']);
    expect(loaded.watched).toEqual(['cs-02']);
    expect(loaded.preferences.name).toBe('FilmGeek');
    expect(loaded.preferences.theme).toBe('light');
  });

  it('gracefully recovers from corrupt JSON without throwing', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid-json-content:::');
    const recovered = loadStoredUserData();
    expect(recovered).toBeDefined();
    expect(recovered.version).toBe(1);
    expect(Array.isArray(recovered.watchlist)).toBe(true);
  });

  it('clears stored data completely on request', () => {
    saveStoredUserData({
      version: 1,
      watchlist: ['cs-01'],
      watched: [],
      recentlyViewed: [],
      recentSearches: [],
      preferences: {
        name: 'Test',
        theme: 'dark',
        viewMode: 'grid',
        preferredGenres: []
      }
    });

    clearStoredUserData();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
