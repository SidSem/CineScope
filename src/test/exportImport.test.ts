import { describe, it, expect } from 'vitest';
import { exportUserDataAsJson, validateAndParseImportData } from '../lib/exportImport';
import { StoredUserData } from '../types/movie';

describe('Data Export and Import Validation', () => {
  const sampleData: StoredUserData = {
    version: 1,
    watchlist: ['cs-01', 'cs-02'],
    watched: ['cs-03'],
    recentlyViewed: ['cs-01'],
    recentSearches: ['Odyssey'],
    preferences: {
      name: 'CinemaMaster',
      theme: 'dark',
      viewMode: 'grid',
      preferredGenres: ['Adventure']
    }
  };

  it('exports valid JSON payload with version and timestamp', () => {
    const exportedJson = exportUserDataAsJson(sampleData);
    expect(typeof exportedJson).toBe('string');
    const parsed = JSON.parse(exportedJson);
    expect(parsed.version).toBe(1);
    expect(parsed.watchlist).toEqual(['cs-01', 'cs-02']);
    expect(parsed.exportedAt).toBeDefined();
  });

  it('successfully validates and parses clean JSON import', () => {
    const raw = JSON.stringify(sampleData);
    const result = validateAndParseImportData(raw);
    expect(result.success).toBe(true);
    expect(result.data?.watchlist).toEqual(['cs-01', 'cs-02']);
    expect(result.data?.preferences.name).toBe('CinemaMaster');
  });

  it('rejects completely malformed JSON strings', () => {
    const result = validateAndParseImportData('Not a JSON string');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Failed to parse file');
  });

  it('rejects primitive JSON or null values', () => {
    expect(validateAndParseImportData('12345').success).toBe(false);
    expect(validateAndParseImportData('null').success).toBe(false);
  });

  it('sanitizes invalid array items and invalid theme values', () => {
    const dirtyData = {
      version: 1,
      watchlist: ['cs-01', 42, null, '', 'cs-02'],
      watched: 'not-an-array',
      preferences: {
        name: 'SafeUser',
        theme: 'neon-cyber-mode', // invalid theme!
        viewMode: 'unknown-view' // invalid view!
      }
    };

    const result = validateAndParseImportData(JSON.stringify(dirtyData));
    expect(result.success).toBe(true);
    expect(result.data?.watchlist).toEqual(['cs-01', 'cs-02']);
    expect(result.data?.watched).toEqual([]);
    expect(result.data?.preferences.theme).toBe('dark'); // safely defaulted
    expect(result.data?.preferences.viewMode).toBe('grid'); // safely defaulted
  });
});
