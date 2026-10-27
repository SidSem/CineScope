import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Check,
  Play,
  Share2,
  DollarSign,
  Globe,
  Film,
  Sparkles,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PageContainer } from '../components/layout/PageContainer';
import { MoviePoster } from '../components/movie/MoviePoster';
import { MovieRail } from '../components/movie/MovieRail';
import { TrailerModal } from '../components/movie/TrailerModal';
import { movieService } from '../services/movieService';
import { getRelatedMovies } from '../lib/recommendations';
import { useWatchlist } from '../hooks/useWatchlist';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useAppStore } from '../store/appStore';
import { formatRuntime, formatDate } from '../lib/utils';
import { EmptyState } from '../components/feedback/EmptyState';

export const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const { isSaved, isWatched, toggleWatchlist, toggleWatched } = useWatchlist();
  const { addRecentlyViewed } = useRecentlyViewed();
  const addToast = useAppStore(state => state.addToast);

  const movie = id ? movieService.getMovieById(id) : undefined;
  const allMovies = movieService.getAllMovies();

  // Document title and recently viewed tracking
  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} (${movie.year}) — CineScope`;
      addRecentlyViewed(movie.id);
    } else {
      document.title = 'Movie Not Found — CineScope';
    }

    return () => {
      document.title = 'CineScope — Digital Cinema Playground';
    };
  }, [movie, addRecentlyViewed]);

  if (!movie) {
    return (
      <PageContainer maxWidth="md">
        <EmptyState
          title="Movie Not Found"
          description={`The film with identifier "${id}" could not be located in our catalog.`}
          actionLabel="Back to Discover"
          actionLink="/discover"
          icon={Film}
        />
      </PageContainer>
    );
  }

  const saved = isSaved(movie.id);
  const watched = isWatched(movie.id);
  const relatedMovies = getRelatedMovies(movie, allMovies, 8);

  const handleWatchlistToggle = () => {
    toggleWatchlist(movie.id, movie.title);
    if (!saved) {
      // Delightful confetti burst
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    const shareData = {
      title: `${movie.title} on CineScope`,
      text: `Check out "${movie.title}" (${movie.year}) on CineScope!`,
      url: currentUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        addToast('Link Shared!', undefined, 'success');
        return;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('[CineScope] Share error:', err);
        }
      }
    }

    // Fallback to Clipboard API
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        addToast('Movie Link Copied!', 'URL copied to your clipboard.', 'success');
        return;
      } catch (err) {
        console.warn('[CineScope] Clipboard copy failed:', err);
      }
    }

    // Manual prompt fallback
    window.prompt('Copy movie link:', currentUrl);
  };

  return (
    <PageContainer maxWidth="7xl">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-cinema-muted hover:text-cinema-text hover:bg-cinema-subtle transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>
      </div>

      {/* Cinematic Hero Backdrop Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden cinema-glass border border-cinema-border shadow-2xl mb-8">
        <div className="relative h-[280px] sm:h-[400px] md:h-[480px] w-full overflow-hidden bg-cinema-elevated">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={`${movie.title} backdrop`}
            className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.05]"
          />
          {/* Subtle gradient scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg via-cinema-bg/75 to-transparent sm:w-2/3" />
        </div>

        {/* Content Over Banner */}
        <div className="absolute bottom-6 sm:bottom-10 inset-x-6 sm:inset-x-10 z-10 flex flex-col sm:flex-row items-end gap-6">
          <div className="max-w-3xl">
            {/* Metadata Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              {movie.rating !== undefined && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-sunshine/20 text-brand-sunshine border border-brand-sunshine/40 backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{movie.rating.toFixed(1)}</span>
                  <span className="text-white/60 font-normal">({movie.ratingSource || 'Consensus'})</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1 text-xs text-white/80 font-medium bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                <Calendar className="w-3.5 h-3.5" />
                {movie.year}
              </span>

              {movie.runtimeMinutes && (
                <span className="inline-flex items-center gap-1 text-xs text-white/80 font-medium bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                  <Clock className="w-3.5 h-3.5" />
                  {formatRuntime(movie.runtimeMinutes)}
                </span>
              )}

              {movie.language && (
                <span className="inline-flex items-center gap-1 text-xs text-white/80 font-medium bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                  <Globe className="w-3.5 h-3.5" />
                  {movie.language}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-tight mb-2">
              {movie.title}
            </h1>

            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p className="text-xs sm:text-sm text-white/70 italic mb-3">
                Original title: &ldquo;{movie.originalTitle}&rdquo;
              </p>
            )}

            {/* Genres */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {movie.genres.map(genre => (
                <Link
                  key={genre}
                  to={`/genres/${genre.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-brand-violet/25 text-brand-violet hover:bg-brand-violet/40 border border-brand-violet/30 transition-colors backdrop-blur-md"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Grid: Left Poster & Quick Info, Right Overview & Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
        {/* Left Column: Poster + Action Buttons */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl overflow-hidden border border-cinema-border shadow-2xl bg-cinema-elevated">
            <MoviePoster
              posterUrl={movie.posterUrl}
              title={movie.title}
              year={movie.year}
              genre={movie.genres[0]}
              className="w-full aspect-[2/3]"
              priority={true}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleWatchlistToggle}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                saved
                  ? 'bg-brand-violet text-white shadow-cinema-glow border border-brand-violet'
                  : 'bg-cinema-surface hover:bg-brand-violet/20 text-cinema-text border border-cinema-border'
              }`}
            >
              {saved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
              <span>{saved ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>

            <button
              onClick={() => toggleWatched(movie.id, movie.title)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                watched
                  ? 'bg-brand-aqua text-black font-bold shadow-aqua-glow'
                  : 'bg-cinema-surface hover:bg-cinema-subtle text-cinema-muted hover:text-cinema-text border border-cinema-border'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{watched ? 'Watched' : 'Mark as Watched'}</span>
            </button>

            {movie.trailerUrl && (
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-pink to-brand-tangerine text-white hover:opacity-95 shadow-pink-glow flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Official Trailer</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-cinema-muted hover:text-cinema-text bg-cinema-surface border border-cinema-border flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Movie</span>
            </button>
          </div>
        </div>

        {/* Right Columns: Overview, Metadata, Cast, Tags */}
        <div className="md:col-span-2 lg:col-span-3 space-y-6">
          {/* Overview */}
          <div className="p-6 rounded-2xl bg-cinema-surface border border-cinema-border shadow-card-elevated">
            <h2 className="text-xl font-bold font-display text-cinema-text mb-3">
              Synopsis
            </h2>
            <p className="text-sm sm:text-base text-cinema-muted leading-relaxed">
              {movie.overview}
            </p>
          </div>

          {/* Credits & Cast */}
          <div className="p-6 rounded-2xl bg-cinema-surface border border-cinema-border shadow-card-elevated space-y-4">
            <h2 className="text-xl font-bold font-display text-cinema-text">
              Key Personnel & Cast
            </h2>

            {movie.director && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cinema-muted block mb-1">
                  Director
                </span>
                <p className="text-sm font-semibold text-cinema-text">
                  {movie.director}
                </p>
              </div>
            )}

            {movie.cast && movie.cast.length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cinema-muted block mb-2">
                  Cast & Characters
                </span>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map(actor => (
                    <span
                      key={actor}
                      className="px-3 py-1.5 rounded-xl bg-cinema-elevated text-cinema-text border border-cinema-border text-xs font-medium"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Financials & Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-cinema-surface border border-cinema-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cinema-muted block mb-1">
                Release Date
              </span>
              <p className="text-sm font-semibold text-cinema-text">
                {formatDate(movie.releaseDate)}
              </p>
            </div>

            {movie.budget && (
              <div className="p-4 rounded-2xl bg-cinema-surface border border-cinema-border">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cinema-muted block mb-1">
                  Production Budget
                </span>
                <p className="text-sm font-semibold text-cinema-text font-mono">
                  {movie.budget}
                </p>
              </div>
            )}

            {movie.revenue && (
              <div className="p-4 rounded-2xl bg-cinema-surface border border-cinema-border">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cinema-muted block mb-1">
                  Box Office
                </span>
                <p className="text-sm font-semibold text-cinema-text font-mono">
                  {movie.revenue}
                </p>
              </div>
            )}
          </div>

          {/* Curated Tags / Keywords */}
          {movie.tags && movie.tags.length > 0 && (
            <div className="p-5 rounded-2xl bg-cinema-surface border border-cinema-border">
              <span className="text-xs font-bold uppercase tracking-wider text-cinema-muted block mb-2.5">
                Thematic Keywords & Discovery Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {movie.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/discover?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-cinema-elevated hover:bg-brand-violet/20 hover:text-brand-violet text-cinema-muted border border-cinema-border transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Movies Recommendation Rail */}
      {relatedMovies.length > 0 && (
        <MovieRail
          title="Related Films You Might Love"
          subtitle={`Based on shared themes with ${movie.title}`}
          movies={relatedMovies}
        />
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        movieTitle={movie.title}
        trailerUrl={movie.trailerUrl}
      />
    </PageContainer>
  );
};
