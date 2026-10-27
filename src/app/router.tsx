import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { Clapperboard } from 'lucide-react';

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
    <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 border border-brand-violet/30 flex items-center justify-center text-brand-violet animate-pulse shadow-cinema-glow">
      <Clapperboard className="w-6 h-6 animate-pulse-subtle" />
    </div>
    <span className="text-xs font-semibold text-cinema-muted tracking-wider uppercase font-mono">
      Loading Scene...
    </span>
  </div>
);

const HomePage = lazy(() => import('../pages/HomePage').then(m => ({ default: m.HomePage })));
const DiscoverPage = lazy(() => import('../pages/DiscoverPage').then(m => ({ default: m.DiscoverPage })));
const MoviePage = lazy(() => import('../pages/MoviePage').then(m => ({ default: m.MoviePage })));
const WatchlistPage = lazy(() => import('../pages/WatchlistPage').then(m => ({ default: m.WatchlistPage })));
const CollectionsPage = lazy(() => import('../pages/CollectionsPage').then(m => ({ default: m.CollectionsPage })));
const CollectionDetailPage = lazy(() => import('../pages/CollectionDetailPage').then(m => ({ default: m.CollectionDetailPage })));
const GenrePage = lazy(() => import('../pages/GenrePage').then(m => ({ default: m.GenrePage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'discover',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DiscoverPage />
          </Suspense>
        ),
      },
      {
        path: 'movie/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MoviePage />
          </Suspense>
        ),
      },
      {
        path: 'watchlist',
        element: (
          <Suspense fallback={<PageLoader />}>
            <WatchlistPage />
          </Suspense>
        ),
      },
      {
        path: 'collections',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CollectionsPage />
          </Suspense>
        ),
      },
      {
        path: 'collections/:slug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CollectionDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'genres/:genre',
        element: (
          <Suspense fallback={<PageLoader />}>
            <GenrePage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);
