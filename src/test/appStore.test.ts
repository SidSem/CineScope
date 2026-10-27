import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store/appStore';

describe('AppStore Watchlist and History State Management', () => {
  beforeEach(() => {
    useAppStore.setState({
      watchlist: [],
      watched: [],
      recentlyViewed: [],
      recentSearches: [],
      toasts: [],
      preferences: {
        name: 'TestUser',
        theme: 'dark',
        viewMode: 'grid',
        preferredGenres: []
      }
    });
  });

  it('adds and removes a movie from the watchlist', () => {
    const { toggleWatchlist } = useAppStore.getState();

    // 1. Add
    toggleWatchlist('cs-01', 'Stellar Odyssey');
    expect(useAppStore.getState().watchlist).toContain('cs-01');

    // 2. Toggle again to remove
    toggleWatchlist('cs-01', 'Stellar Odyssey');
    expect(useAppStore.getState().watchlist).not.toContain('cs-01');
  });

  it('toggles watched status on and off', () => {
    const { toggleWatched } = useAppStore.getState();

    toggleWatched('cs-02', 'Neon City Noir');
    expect(useAppStore.getState().watched).toContain('cs-02');

    toggleWatched('cs-02', 'Neon City Noir');
    expect(useAppStore.getState().watched).not.toContain('cs-02');
  });

  it('tracks recently viewed without duplicating entries', () => {
    const { addRecentlyViewed } = useAppStore.getState();

    addRecentlyViewed('cs-01');
    addRecentlyViewed('cs-02');
    addRecentlyViewed('cs-01'); // should move to front

    const state = useAppStore.getState();
    expect(state.recentlyViewed[0]).toBe('cs-01');
    expect(state.recentlyViewed[1]).toBe('cs-02');
    expect(state.recentlyViewed.filter(id => id === 'cs-01')).toHaveLength(1);
  });

  it('clears watchlist properly', () => {
    const { addToWatchlist, clearWatchlist } = useAppStore.getState();

    addToWatchlist('cs-01');
    addToWatchlist('cs-02');
    expect(useAppStore.getState().watchlist).toHaveLength(2);

    clearWatchlist();
    expect(useAppStore.getState().watchlist).toHaveLength(0);
  });
});
