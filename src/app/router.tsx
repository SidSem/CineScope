import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ErrorState } from '../components/feedback/ErrorState';
import { HomePage } from '../pages/HomePage';
import { DiscoverPage } from '../pages/DiscoverPage';
import { MoviePage } from '../pages/MoviePage';
import { WatchlistPage } from '../pages/WatchlistPage';
import { CollectionsPage } from '../pages/CollectionsPage';
import { CollectionDetailPage } from '../pages/CollectionDetailPage';
import { GenrePage } from '../pages/GenrePage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorState />,
    children: [
      {
        index: true,
        element: <HomePage />,
        errorElement: <ErrorState />,
      },
      {
        path: 'discover',
        element: <DiscoverPage />,
        errorElement: <ErrorState />,
      },
      {
        path: 'movie/:id',
        element: <MoviePage />,
        errorElement: <ErrorState />,
      },
      {
        path: 'watchlist',
        element: <WatchlistPage />,
        errorElement: <ErrorState />,
      },
      {
        path: 'collections',
        element: <CollectionsPage />,
        errorElement: <ErrorState />,
      },
      {
        path: 'collections/:slug',
        element: <CollectionDetailPage />,
        errorElement: <ErrorState />,
      },
      {
        path: 'genres/:genre',
        element: <GenrePage />,
        errorElement: <ErrorState />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
        errorElement: <ErrorState />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
