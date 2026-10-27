import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Flame,
  Clapperboard,
  ArrowRight,
  Clock,
  Compass,
  Zap,
  Smile,
  ShieldAlert,
  Video,
  HeartHandshake,
  Wand2,
  Ghost,
  Search,
  Heart,
  Rocket,
  Coffee,
  Brain,
  CloudRain,
  Users,
  Moon,
  Sun,
  Trash2
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { MovieHero } from '../components/movie/MovieHero';
import { MovieRail } from '../components/movie/MovieRail';
import { TrailerModal } from '../components/movie/TrailerModal';
import { movieService } from '../services/movieService';
import { GENRES } from '../data/genres';
import { MOODS } from '../data/moods';
import { COLLECTIONS } from '../data/collections';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';

// Map icon strings to Lucide components safely
const GENRE_ICONS: Record<string, React.ElementType> = {
  Zap,
  Compass,
  Sparkles,
  Smile,
  ShieldAlert,
  Video,
  HeartHandshake,
  Wand2,
  Ghost,
  Search,
  Heart,
  Rocket,
  Flame
};

const MOOD_ICONS: Record<string, React.ElementType> = {
  Sun,
  Brain,
  Flame,
  Coffee,
  CloudRain,
  Users,
  Heart,
  Moon
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTrailerUrl, setActiveTrailerUrl] = useState<string | null>(null);
  const [trailerMovieTitle, setTrailerMovieTitle] = useState('');

  const { recentMovies, clearRecentlyViewed } = useRecentlyViewed();

  const featuredMovies = movieService.getFeaturedMovies();
  const trendingMovies = movieService.getTrendingMovies();
  const popularPicks = movieService.getPopularPicks();

  const handleOpenTrailer = (trailerUrl?: string, title = 'Movie') => {
    if (trailerUrl) {
      setTrailerMovieTitle(title);
      setActiveTrailerUrl(trailerUrl);
    }
  };

  return (
    <PageContainer maxWidth="7xl">
      {/* 1. Immersive Hero Carousel */}
      <MovieHero
        movies={featuredMovies}
        onOpenTrailer={handleOpenTrailer}
      />

      {/* 2. Trending Now Movie Rail */}
      <MovieRail
        title="Trending Now"
        subtitle="The most celebrated titles in our current catalog"
        movies={trendingMovies}
        exploreLink="/discover?sort=popularity"
        exploreLabel="View Trending"
        onOpenTrailer={handleOpenTrailer}
      />

      {/* 3. Pick Your Mood Discovery Section */}
      <section className="my-12 sm:my-16">
        <div className="flex items-end justify-between mb-6 px-1">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-sunshine/10 text-brand-sunshine border border-brand-sunshine/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Atmosphere Filter</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-cinema-text">
              Pick Your Mood
            </h2>
            <p className="text-xs sm:text-sm text-cinema-muted mt-1">
              Select what emotional wavelength you want to travel tonight
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {MOODS.map(mood => {
            const Icon = MOOD_ICONS[mood.icon] || Sparkles;
            return (
              <button
                key={mood.id}
                onClick={() => navigate(`/discover?mood=${mood.id}`)}
                className="group relative p-4 sm:p-5 rounded-2xl bg-cinema-surface border border-cinema-border hover:border-brand-violet/50 hover:shadow-cinema-glow transition-all duration-300 text-left flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${mood.accentColor}18`,
                    color: mood.accentColor,
                    borderColor: `${mood.accentColor}30`,
                    borderWidth: 1
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold font-display text-cinema-text group-hover:text-brand-violet transition-colors">
                    {mood.name}
                  </h3>
                  <p className="text-xs text-cinema-muted line-clamp-2 mt-1 leading-snug">
                    {mood.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-cinema-border flex items-center justify-between text-xs font-semibold text-brand-violet group-hover:translate-x-1 transition-transform">
                  <span>Explore Films</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Popular This Week / CineScope Picks (Numbered Cards) */}
      <MovieRail
        title="CineScope Top Picks"
        subtitle="Critically acclaimed masterworks with unanimous praise"
        movies={popularPicks}
        numbered={true}
        exploreLink="/discover?sort=rating-desc"
        exploreLabel="View All High Rated"
        onOpenTrailer={handleOpenTrailer}
      />

      {/* 5. Browse by Genre Grid */}
      <section className="my-12 sm:my-16">
        <div className="flex items-end justify-between mb-6 px-1">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-cinema-text">
              Browse by Genre
            </h2>
            <p className="text-xs sm:text-sm text-cinema-muted mt-1">
              Deep dive into distinct styles and storytelling traditions
            </p>
          </div>
          <Link
            to="/discover"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-brand-violet hover:text-brand-pink transition-colors"
          >
            <span>All Genres</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {GENRES.map(genre => {
            const Icon = GENRE_ICONS[genre.iconName] || Clapperboard;
            return (
              <Link
                key={genre.slug}
                to={`/genres/${genre.slug}`}
                className="group relative p-4 sm:p-5 rounded-2xl bg-cinema-surface border border-cinema-border hover:border-brand-violet/50 hover:shadow-card-elevated transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Decorative subtle background gradient blob */}
                <div
                  className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${genre.gradient} opacity-10 group-hover:opacity-25 transition-opacity blur-xl`}
                />

                <div className="flex items-center justify-between mb-3 z-10">
                  <div className="p-2.5 rounded-xl bg-cinema-elevated text-brand-violet group-hover:scale-110 transition-transform border border-cinema-border">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-cinema-muted group-hover:text-brand-pink transition-colors">
                    Explore →
                  </span>
                </div>

                <div className="z-10">
                  <h3 className="text-base font-bold font-display text-cinema-text group-hover:text-brand-violet transition-colors">
                    {genre.name}
                  </h3>
                  <p className="text-xs text-cinema-muted line-clamp-1 mt-0.5">
                    {genre.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. Curated Collections Preview */}
      <section className="my-12 sm:my-16">
        <div className="flex items-end justify-between mb-6 px-1">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-violet/15 text-brand-violet border border-brand-violet/25 mb-2">
              <Clapperboard className="w-3.5 h-3.5" />
              <span>CineScope Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-cinema-text">
              Curated Cinema Playlists
            </h2>
            <p className="text-xs sm:text-sm text-cinema-muted mt-1">
              Hand-picked thematic collections designed for specific moments
            </p>
          </div>
          <Link
            to="/collections"
            className="text-xs font-semibold text-brand-violet hover:text-brand-pink transition-colors flex items-center gap-1"
          >
            <span>All Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COLLECTIONS.slice(0, 3).map(col => (
            <Link
              key={col.id}
              to={`/collections/${col.slug}`}
              className="group relative rounded-2xl overflow-hidden cinema-glass border border-cinema-border hover:border-brand-violet/50 hover:shadow-cinema-glow transition-all duration-300 flex flex-col justify-end h-64 sm:h-72 p-6"
            >
              {/* Background Cover Image with Gradients */}
              <img
                src={col.coverImage}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.55] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/60 to-transparent" />

              <div className="relative z-10">
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold text-white mb-2 shadow-sm"
                  style={{ backgroundColor: col.accentColor }}
                >
                  {col.movieIds.length} Films
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-brand-pink transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-2 mt-1 leading-relaxed">
                  {col.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                  <span>Browse Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Recently Explored Section (if user has viewed any) */}
      {recentMovies.length > 0 && (
        <section className="my-12 sm:my-16">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-tangerine" />
              <h2 className="text-xl font-bold font-display text-cinema-text">
                Recently Explored
              </h2>
            </div>
            <button
              onClick={clearRecentlyViewed}
              className="inline-flex items-center gap-1 text-xs text-cinema-muted hover:text-brand-pink transition-colors font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
            {recentMovies.map((movie, index) => (
              <div key={movie.id} className="w-[160px] sm:w-[190px] flex-shrink-0">
                <MovieRail
                  title=""
                  movies={[movie]}
                  exploreLink=""
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={Boolean(activeTrailerUrl)}
        onClose={() => setActiveTrailerUrl(null)}
        movieTitle={trailerMovieTitle}
        trailerUrl={activeTrailerUrl || undefined}
      />
    </PageContainer>
  );
};
