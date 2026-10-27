import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, ArrowRight, Film } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { COLLECTIONS } from '../data/collections';

export const CollectionsPage: React.FC = () => {
  return (
    <PageContainer maxWidth="7xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-violet/15 text-brand-violet border border-brand-violet/25 mb-2">
          <Clapperboard className="w-3.5 h-3.5" />
          <span>Curated Playlists</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-cinema-text">
          Curated Movie Collections
        </h1>
        <p className="text-sm text-cinema-muted mt-1 max-w-xl">
          Thematically bundled cinematic journeys crafted by film enthusiasts. Perfect for movie marathons, cozy nights, and intellectual rabbit holes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COLLECTIONS.map(col => (
          <Link
            key={col.id}
            to={`/collections/${col.slug}`}
            className="group relative rounded-3xl overflow-hidden cinema-glass border border-cinema-border hover:border-brand-violet/50 hover:shadow-cinema-glow transition-all duration-300 flex flex-col justify-end h-80 sm:h-96 p-6 sm:p-8"
          >
            {/* Background Cover Image */}
            <img
              src={col.coverImage}
              alt={col.title}
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.5] group-hover:scale-105 transition-transform duration-500"
            />
            {/* Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/70 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: col.accentColor }}
                >
                  {col.movieIds.length} Curated Titles
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white group-hover:text-brand-pink transition-colors mb-2">
                {col.title}
              </h2>

              <p className="text-xs sm:text-sm text-white/80 line-clamp-3 leading-relaxed mb-4">
                {col.description}
              </p>

              <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                <span>Browse Entire Collection</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
};
