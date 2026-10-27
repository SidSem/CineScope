import { StoredUserData } from '../types/movie';
import { CURRENT_STORAGE_VERSION } from './storage';

export interface ImportValidationResult {
  success: boolean;
  data?: StoredUserData;
  error?: string;
}

export function exportUserDataAsJson(data: StoredUserData): string {
  const exportPayload: StoredUserData = {
    ...data,
    version: CURRENT_STORAGE_VERSION,
    exportedAt: new Date().toISOString()
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function validateAndParseImportData(rawJson: string): ImportValidationResult {
  if (!rawJson || typeof rawJson !== 'string') {
    return { success: false, error: 'Empty or invalid input provided.' };
  }

  try {
    const parsed = JSON.parse(rawJson);

    if (typeof parsed !== 'object' || parsed === null) {
      return { success: false, error: 'Import file must be a valid JSON object.' };
    }

    // Check version compatibility
    if (typeof parsed.version !== 'number' || parsed.version < 1) {
      return { success: false, error: 'Unsupported or missing backup version.' };
    }

    // Validate arrays
    const cleanWatchlist = Array.isArray(parsed.watchlist)
      ? parsed.watchlist.filter((id: unknown): id is string => typeof id === 'string' && id.trim().length > 0)
      : [];

    const cleanWatched = Array.isArray(parsed.watched)
      ? parsed.watched.filter((id: unknown): id is string => typeof id === 'string' && id.trim().length > 0)
      : [];

    const cleanRecentlyViewed = Array.isArray(parsed.recentlyViewed)
      ? parsed.recentlyViewed.filter((id: unknown): id is string => typeof id === 'string' && id.trim().length > 0)
      : [];

    const cleanSearches = Array.isArray(parsed.recentSearches)
      ? parsed.recentSearches.filter((s: unknown): s is string => typeof s === 'string' && s.trim().length > 0)
      : [];

    // Validate preferences
    const validThemes = ['dark', 'light'] as const;
    const theme = validThemes.includes(parsed.preferences?.theme)
      ? parsed.preferences.theme
      : 'dark';

    const validViews = ['grid', 'list'] as const;
    const viewMode = validViews.includes(parsed.preferences?.viewMode)
      ? parsed.preferences.viewMode
      : 'grid';

    const name = typeof parsed.preferences?.name === 'string'
      ? parsed.preferences.name.slice(0, 50).trim()
      : 'Cinephile';

    const preferredGenres = Array.isArray(parsed.preferences?.preferredGenres)
      ? parsed.preferences.preferredGenres.filter((g: unknown): g is string => typeof g === 'string')
      : [];

    const validData: StoredUserData = {
      version: CURRENT_STORAGE_VERSION,
      watchlist: cleanWatchlist,
      watched: cleanWatched,
      recentlyViewed: cleanRecentlyViewed,
      recentSearches: cleanSearches,
      preferences: {
        name: name || 'Cinephile',
        theme,
        viewMode,
        preferredGenres
      },
      exportedAt: parsed.exportedAt || new Date().toISOString()
    };

    return { success: true, data: validData };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid JSON format.';
    return { success: false, error: `Failed to parse file: ${message}` };
  }
}
