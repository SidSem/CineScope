import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw, Compass } from 'lucide-react';
import { PageContainer } from '../layout/PageContainer';

export const ErrorState: React.FC = () => {
  const error = useRouteError();

  let errorMessage = 'An unexpected cinematic anomaly occurred.';
  let errorStatus = 'Error';

  if (isRouteErrorResponse(error)) {
    errorStatus = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const isModuleFetchError = errorMessage.toLowerCase().includes('failed to fetch') ||
    errorMessage.toLowerCase().includes('dynamically imported');

  return (
    <PageContainer maxWidth="md" className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center p-8 sm:p-12 rounded-3xl cinema-glass border border-cinema-border shadow-2xl bg-cinema-surface max-w-lg w-full">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 text-brand-pink mx-auto flex items-center justify-center mb-5 shadow-pink-glow">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <span className="font-mono text-xs font-bold text-brand-pink tracking-widest uppercase block mb-1">
          {errorStatus}
        </span>

        <h1 className="text-2xl sm:text-3xl font-black font-display text-cinema-text mb-3">
          Playback Interrupted
        </h1>

        <p className="text-xs sm:text-sm text-cinema-muted leading-relaxed mb-6">
          {isModuleFetchError
            ? 'A connection hiccup prevented loading this view. Click reload below to refresh the scene.'
            : errorMessage}
        </p>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-violet to-brand-pink text-white hover:opacity-95 shadow-cinema-glow transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Scene</span>
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-cinema-elevated text-cinema-text hover:bg-cinema-subtle border border-cinema-border transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Premiere</span>
          </Link>

          <Link
            to="/discover"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-cinema-elevated text-cinema-text hover:bg-cinema-subtle border border-cinema-border transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Discover</span>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};
