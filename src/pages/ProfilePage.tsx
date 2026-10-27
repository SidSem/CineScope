import React, { useState, useRef, useMemo } from 'react';
import {
  User,
  Sun,
  Moon,
  Bookmark,
  CheckCircle2,
  Download,
  Upload,
  Trash2,
  Shield,
  Sparkles,
  BarChart3,
  Clock,
  Info
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { useAppStore } from '../store/appStore';
import { useWatchlist } from '../hooks/useWatchlist';
import { useTheme } from '../hooks/useTheme';
import { GENRE_NAMES } from '../data/genres';
import { exportUserDataAsJson, validateAndParseImportData } from '../lib/exportImport';

export const ProfilePage: React.FC = () => {
  const { watchlistMovies, watchedMovies, watchlistCount, watchedCount } = useWatchlist();
  const { theme, setTheme } = useTheme();

  const preferences = useAppStore(state => state.preferences);
  const updatePreferences = useAppStore(state => state.updatePreferences);
  const importUserData = useAppStore(state => state.importUserData);
  const resetAllData = useAppStore(state => state.resetAllData);
  const addToast = useAppStore(state => state.addToast);
  const recentlyViewed = useAppStore(state => state.recentlyViewed);
  const clearRecentlyViewed = useAppStore(state => state.clearRecentlyViewed);
  const recentSearches = useAppStore(state => state.recentSearches);
  const clearRecentSearches = useAppStore(state => state.clearRecentSearches);

  const [displayName, setDisplayName] = useState(preferences.name || 'Cinephile');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Genre distribution statistics among watched + saved films
  const genreDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    const allCombined = [...watchedMovies, ...watchlistMovies];

    allCombined.forEach(m => {
      m.genres.forEach(g => {
        counts[g] = (counts[g] || 0) + 1;
      });
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = sorted[0]?.[1] || 1;
    return { list: sorted.slice(0, 6), max };
  }, [watchedMovies, watchlistMovies]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({ name: displayName.trim() || 'Cinephile' });
  };

  const togglePreferredGenre = (genre: string) => {
    const current = preferences.preferredGenres || [];
    const updated = current.includes(genre)
      ? current.filter(g => g !== genre)
      : [...current, genre];
    updatePreferences({ preferredGenres: updated });
  };

  // Export JSON file download
  const handleExport = () => {
    const state = useAppStore.getState();
    const jsonString = exportUserDataAsJson({
      version: 1,
      watchlist: state.watchlist,
      watched: state.watched,
      recentlyViewed: state.recentlyViewed,
      recentSearches: state.recentSearches,
      preferences: state.preferences
    });

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cinescope-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast('Backup Exported!', 'Saved CineScope JSON backup to your downloads.', 'success');
  };

  // Import JSON file handler with validation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const result = validateAndParseImportData(content);

      if (result.success && result.data) {
        importUserData(result.data);
        setDisplayName(result.data.preferences.name);
      } else {
        addToast('Import Failed', result.error || 'Corrupted or invalid JSON backup file.', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <PageContainer maxWidth="lg">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-violet/15 text-brand-violet border border-brand-violet/25 mb-2">
          <User className="w-3.5 h-3.5" />
          <span>Local Profile & Settings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-cinema-text">
          Preferences & Viewing Activity
        </h1>
        <p className="text-sm text-cinema-muted mt-1 max-w-xl">
          Manage your interface theme, preferred cinema genres, viewing stats, and portable JSON data.
        </p>
      </div>

      {/* Local Storage Notice Banner */}
      <div className="p-4 rounded-2xl cinema-glass border border-brand-violet/30 bg-brand-violet/5 mb-8 flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-violet flex-shrink-0 mt-0.5" />
        <p className="text-xs text-cinema-muted leading-relaxed">
          <strong className="text-cinema-text">Local Browser Data:</strong> CineScope operates frontend-only with zero tracking or remote databases. All watchlists, history, and preferences are stored securely in your browser’s localStorage.
        </p>
      </div>

      {/* Activity Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-cinema-surface border border-cinema-border shadow-card-elevated">
          <div className="flex items-center justify-between text-cinema-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Watchlist</span>
            <Bookmark className="w-4 h-4 text-brand-violet" />
          </div>
          <span className="text-3xl font-extrabold font-display text-cinema-text">
            {watchlistCount}
          </span>
          <span className="text-[11px] text-cinema-muted block mt-1">Saved for later</span>
        </div>

        <div className="p-5 rounded-2xl bg-cinema-surface border border-cinema-border shadow-card-elevated">
          <div className="flex items-center justify-between text-cinema-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Watched</span>
            <CheckCircle2 className="w-4 h-4 text-brand-aqua" />
          </div>
          <span className="text-3xl font-extrabold font-display text-cinema-text">
            {watchedCount}
          </span>
          <span className="text-[11px] text-cinema-muted block mt-1">Logged movies</span>
        </div>

        <div className="p-5 rounded-2xl bg-cinema-surface border border-cinema-border shadow-card-elevated">
          <div className="flex items-center justify-between text-cinema-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Explored</span>
            <Clock className="w-4 h-4 text-brand-tangerine" />
          </div>
          <span className="text-3xl font-extrabold font-display text-cinema-text">
            {recentlyViewed.length}
          </span>
          <span className="text-[11px] text-cinema-muted block mt-1">Recently viewed</span>
        </div>

        <div className="p-5 rounded-2xl bg-cinema-surface border border-cinema-border shadow-card-elevated">
          <div className="flex items-center justify-between text-cinema-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Searches</span>
            <Sparkles className="w-4 h-4 text-brand-sunshine" />
          </div>
          <span className="text-3xl font-extrabold font-display text-cinema-text">
            {recentSearches.length}
          </span>
          <span className="text-[11px] text-cinema-muted block mt-1">Stored queries</span>
        </div>
      </div>

      {/* Genre Taste Breakdown (SVG Visualizer) */}
      <div className="p-6 rounded-3xl bg-cinema-surface border border-cinema-border shadow-card-elevated mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-violet" />
            <h2 className="text-lg font-bold font-display text-cinema-text">
              Your Cinema Taste Distribution
            </h2>
          </div>
          <span className="text-xs text-cinema-muted">
            Based on saved & watched films
          </span>
        </div>

        {genreDistribution.list.length === 0 ? (
          <p className="text-xs text-cinema-muted italic py-4">
            Add movies to your watchlist or mark films as watched to reveal your personal genre distribution graph.
          </p>
        ) : (
          <div className="space-y-3 pt-2">
            {genreDistribution.list.map(([genre, count], idx) => {
              const colors = [
                'bg-brand-violet',
                'bg-brand-pink',
                'bg-brand-tangerine',
                'bg-brand-aqua',
                'bg-brand-sunshine',
                'bg-purple-500'
              ];
              const percentage = Math.round((count / genreDistribution.max) * 100);

              return (
                <div key={genre} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-cinema-text">{genre}</span>
                    <span className="text-cinema-muted font-mono">{count} films</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-cinema-elevated overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colors[idx % colors.length]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preferences Section: Display Name, Theme, Preferred Genres */}
      <div className="p-6 sm:p-8 rounded-3xl bg-cinema-surface border border-cinema-border shadow-card-elevated space-y-6 mb-8">
        <h2 className="text-lg font-bold font-display text-cinema-text pb-3 border-b border-cinema-border">
          Display & Appearance
        </h2>

        {/* Display Name Form */}
        <form onSubmit={handleSaveName} className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-cinema-muted block">
            Cinephile Handle (Local Preference)
          </label>
          <div className="flex gap-3 max-w-md">
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="e.g. CinemaLover"
              maxLength={40}
              className="flex-1 px-4 py-2.5 rounded-xl bg-cinema-elevated border border-cinema-border text-sm text-cinema-text focus:outline-none focus:border-brand-violet"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-violet text-white hover:opacity-90 shadow-cinema-glow transition-all"
            >
              Save
            </button>
          </div>
        </form>

        {/* Theme Preference Toggle */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-cinema-muted block mb-2.5">
            Color Theme
          </label>
          <div className="flex gap-3 max-w-sm">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-brand-violet text-white border-brand-violet shadow-cinema-glow'
                  : 'bg-cinema-elevated text-cinema-muted hover:text-cinema-text border-cinema-border'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Dark Theme (Default)</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all ${
                theme === 'light'
                  ? 'bg-brand-violet text-white border-brand-violet shadow-cinema-glow'
                  : 'bg-cinema-elevated text-cinema-muted hover:text-cinema-text border-cinema-border'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Light Theme</span>
            </button>
          </div>
        </div>

        {/* Favorite Genres Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-cinema-muted block mb-2.5">
            Preferred Genres
          </label>
          <div className="flex flex-wrap gap-2">
            {GENRE_NAMES.map(genre => {
              const isSelected = preferences.preferredGenres?.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => togglePreferredGenre(genre)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-brand-pink text-white shadow-pink-glow'
                      : 'bg-cinema-elevated text-cinema-muted hover:text-cinema-text border border-cinema-border'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Data Management Section: Export, Import, Reset */}
      <div className="p-6 sm:p-8 rounded-3xl bg-cinema-surface border border-cinema-border shadow-card-elevated space-y-6">
        <h2 className="text-lg font-bold font-display text-cinema-text pb-3 border-b border-cinema-border flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-aqua" />
          <span>Data Portability & Storage Management</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export JSON */}
          <div className="p-5 rounded-2xl bg-cinema-elevated border border-cinema-border flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-cinema-text mb-1">
                Export CineScope Data
              </h3>
              <p className="text-xs text-cinema-muted leading-relaxed mb-4">
                Download a clean, structured JSON file containing all your saved watchlists, watched history, and preferences.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cinema-surface hover:bg-brand-violet hover:text-white border border-cinema-border hover:border-brand-violet transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Backup (.JSON)</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-5 rounded-2xl bg-cinema-elevated border border-cinema-border flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-cinema-text mb-1">
                Restore From Backup
              </h3>
              <p className="text-xs text-cinema-muted leading-relaxed mb-4">
                Import a previously exported CineScope backup file. Validates schema before applying.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
                id="cinescope-import-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cinema-surface hover:bg-brand-aqua hover:text-black border border-cinema-border hover:border-brand-aqua transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Backup File</span>
              </button>
            </div>
          </div>
        </div>

        {/* Clear History & Reset App Data */}
        <div className="pt-4 border-t border-cinema-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={clearRecentlyViewed}
              className="text-xs font-semibold text-cinema-muted hover:text-cinema-text px-3 py-1.5 rounded-lg border border-cinema-border"
            >
              Clear Explored History
            </button>
            <button
              type="button"
              onClick={clearRecentSearches}
              className="text-xs font-semibold text-cinema-muted hover:text-cinema-text px-3 py-1.5 rounded-lg border border-cinema-border"
            >
              Clear Search Queries
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-600/90 border border-red-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset All CineScope Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog for Complete Reset */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset All CineScope Storage?"
        message="This will completely clear your watchlist, watched movies, explored history, and saved preferences back to defaults. Export a backup first if you wish to preserve your data."
        confirmLabel="Yes, Reset Everything"
        cancelLabel="Keep My Data"
        isDestructive={true}
        onConfirm={() => {
          resetAllData();
          setIsResetConfirmOpen(false);
          setDisplayName('Cinephile');
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </PageContainer>
  );
};
