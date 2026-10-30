import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, Compass } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';

export const NotFoundPage: React.FC = () => {
  return (
    <PageContainer maxWidth="md" className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center p-8 sm:p-12 rounded-3xl cinema-glass border border-cinema-border shadow-2xl bg-cinema-surface max-w-lg w-full">
        {/* Cinema Icon Graphic */}
        <div className="w-20 h-20 rounded-2xl bg-brand-violet/10 border border-brand-violet/30 text-brand-violet mx-auto flex items-center justify-center mb-6 shadow-cinema-glow">
          <Film className="w-10 h-10 animate-float" />
        </div>

        <span className="font-mono text-sm font-bold text-brand-pink tracking-widest uppercase block mb-1">
          Error 404 • Lost in the Archives
        </span>

        <h1 className="text-3xl sm:text-4xl font-black font-display text-cinema-text mb-3">
          Scene Not Found
        </h1>

        <p className="text-xs sm:text-sm text-cinema-muted leading-relaxed mb-8">
          The cinematic sequence or movie link you requested seems to have been cut in the editing room.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-violet to-brand-pink text-white hover:opacity-95 shadow-cinema-glow transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Premiere</span>
          </Link>

          <Link
            to="/discover"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-cinema-elevated text-cinema-text hover:bg-cinema-subtle border border-cinema-border transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Catalog</span>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};
