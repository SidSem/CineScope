import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, Heart, Film } from 'lucide-react';
import { GENRES } from '../../data/genres';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-cinema-border bg-cinema-surface/50 pb-20 md:pb-12 pt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-violet to-brand-pink p-[2px] shadow-cinema-glow">
                <div className="w-full h-full rounded-[6px] bg-cinema-bg flex items-center justify-center">
                  <Clapperboard className="w-4 h-4 text-brand-pink" />
                </div>
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-gradient-cinema">
                CineScope
              </span>
            </Link>
            <p className="text-xs text-cinema-muted leading-relaxed mb-4">
              An advanced, frontend-only movie discovery playground. Curate watchlists, explore curated collections, and experience digital cinema aesthetic.
            </p>
            <div className="flex items-center gap-2 text-xs text-cinema-muted">
              <span>Client-rendered • Offline ready</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cinema-text mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-cinema-muted">
              <li>
                <Link to="/" className="hover:text-brand-violet transition-colors">
                  Home Premiere
                </Link>
              </li>
              <li>
                <Link to="/discover" className="hover:text-brand-violet transition-colors">
                  Discover Catalog
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-brand-violet transition-colors">
                  Curated Collections
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="hover:text-brand-violet transition-colors">
                  Saved Watchlist
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-brand-violet transition-colors">
                  Personal Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres Grid */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cinema-text mb-4">
              Browse by Genre
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GENRES.slice(0, 9).map(genre => (
                <Link
                  key={genre.slug}
                  to={`/genres/${genre.slug}`}
                  className="text-xs text-cinema-muted hover:text-brand-violet transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-violet/40" />
                  <span>{genre.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 border-t border-cinema-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cinema-muted text-center sm:text-left">
          <p>
            CineScope is a movie discovery and watchlist platform. All metadata and media are used for illustrative, educational, and discovery purposes.
          </p>
          <div className="flex items-center gap-4 flex-shrink-0">
            <span>Built with React 19 & Vite</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-brand-pink fill-current inline" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
