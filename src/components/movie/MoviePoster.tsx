import React, { useState } from 'react';
import { Clapperboard } from 'lucide-react';

interface MoviePosterProps {
  posterUrl?: string;
  title: string;
  year?: number;
  genre?: string;
  className?: string;
  aspectRatio?: 'poster' | 'backdrop' | 'square';
  priority?: boolean;
}

export const MoviePoster: React.FC<MoviePosterProps> = ({
  posterUrl,
  title,
  year,
  genre,
  className = '',
  aspectRatio = 'poster',
  priority = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Generate deterministic gradient based on title hash
  const getGradientFromTitle = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const gradients = [
      'from-brand-violet via-purple-900 to-cinema-bg',
      'from-brand-pink via-rose-950 to-cinema-bg',
      'from-brand-tangerine via-amber-950 to-cinema-bg',
      'from-brand-aqua via-teal-950 to-cinema-bg',
      'from-brand-sunshine via-stone-900 to-cinema-bg'
    ];
    return gradients[Math.abs(hash) % gradients.length];
  };

  const aspectClass =
    aspectRatio === 'backdrop'
      ? 'aspect-video'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : 'aspect-[2/3]';

  const showFallback = !posterUrl || imageError;

  return (
    <div
      className={`relative overflow-hidden bg-cinema-elevated select-none ${aspectClass} ${className}`}
    >
      {!showFallback ? (
        <>
          {/* Skeleton placeholder while loading */}
          {!loaded && (
            <div className="absolute inset-0 bg-cinema-elevated animate-pulse flex items-center justify-center">
              <Clapperboard className="w-8 h-8 text-cinema-muted/40 animate-pulse-subtle" />
            </div>
          )}
          <img
            src={posterUrl}
            alt={`${title} poster`}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={() => setLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </>
      ) : (
        /* Designer Fallback Poster */
        <div
          className={`w-full h-full bg-gradient-to-br ${getGradientFromTitle(
            title
          )} p-4 flex flex-col justify-between relative border border-cinema-border`}
        >
          {/* Stylized background watermark film art */}
          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
            <Clapperboard className="w-36 h-36 text-white" />
          </div>

          <div className="flex items-center justify-between z-10">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/10 text-white backdrop-blur-sm">
              {genre || 'Film'}
            </span>
            {year && (
              <span className="text-xs font-mono text-white/70">
                {year}
              </span>
            )}
          </div>

          <div className="z-10 mt-auto">
            <div className="w-8 h-8 rounded-lg bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-brand-violet mb-2">
              <Clapperboard className="w-4 h-4" />
            </div>
            <h4 className="text-sm sm:text-base font-bold font-display text-white line-clamp-2 leading-tight">
              {title}
            </h4>
            <p className="text-[11px] text-white/60 mt-1 uppercase tracking-wider font-semibold">
              CineScope Original
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
