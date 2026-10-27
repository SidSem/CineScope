import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Bookmark, Compass, Sparkles, User, Search, Clapperboard } from 'lucide-react';
import { useWatchlist } from '../../hooks/useWatchlist';
import { useTheme } from '../../hooks/useTheme';

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const { watchlistCount } = useWatchlist();
  const { isDark, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'Collections', path: '/collections', icon: Clapperboard },
    { name: 'Watchlist', path: '/watchlist', icon: Bookmark, badge: watchlistCount },
  ];

  return (
    <header className="sticky top-0 z-40 w-full cinema-glass border-b border-cinema-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-violet rounded-xl p-1"
          aria-label="CineScope Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-violet via-brand-pink to-brand-tangerine p-[2px] shadow-cinema-glow transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-[10px] bg-cinema-bg flex items-center justify-center">
              <Clapperboard className="w-5 h-5 text-brand-pink" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-gradient-cinema">
              CineScope
            </span>
            <span className="text-[10px] tracking-wider uppercase text-cinema-muted -mt-1 font-semibold hidden sm:inline">
              Cinema Playground
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map(link => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'text-brand-violet bg-brand-violet/10 font-bold'
                    : 'text-cinema-muted hover:text-cinema-text hover:bg-cinema-subtle'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>

                {link.badge !== undefined && link.badge > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-brand-violet text-white shadow-sm">
                    {link.badge}
                  </span>
                )}

                {active && (
                  <span className="absolute bottom-0 inset-x-3.5 h-0.5 rounded-full bg-brand-violet" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Search Link, Theme Toggle, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/discover"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-cinema-surface border border-cinema-border text-cinema-muted hover:text-cinema-text hover:border-brand-violet/40 transition-colors flex items-center gap-2 text-xs font-semibold"
            aria-label="Search Catalog"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search Films...</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-cinema-surface border border-cinema-border text-cinema-muted hover:text-brand-sunshine hover:border-brand-sunshine/40 transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Profile Link */}
          <Link
            to="/profile"
            className={`p-2.5 rounded-xl border transition-all ${
              isActive('/profile')
                ? 'bg-brand-violet text-white border-brand-violet shadow-cinema-glow'
                : 'bg-cinema-surface border-cinema-border text-cinema-muted hover:text-cinema-text hover:border-brand-violet/40'
            }`}
            aria-label="User Profile and Preferences"
            title="Profile & Settings"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
