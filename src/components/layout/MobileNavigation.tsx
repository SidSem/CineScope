import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Compass, Bookmark, User, Clapperboard } from 'lucide-react';
import { useWatchlist } from '../../hooks/useWatchlist';

export const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const { watchlistCount } = useWatchlist();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const tabs = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'Collections', path: '/collections', icon: Clapperboard },
    { name: 'Watchlist', path: '/watchlist', icon: Bookmark, badge: watchlistCount },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 cinema-glass border-t border-cinema-border pb-[env(safe-area-inset-bottom)] transition-colors"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 h-16 items-center px-2">
        {tabs.map(tab => {
          const active = isActive(tab.path);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors relative ${
                active
                  ? 'text-brand-violet font-bold'
                  : 'text-cinema-muted hover:text-cinema-text'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full text-[10px] font-bold bg-brand-violet text-white flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{tab.name}</span>
              {active && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-brand-violet" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
