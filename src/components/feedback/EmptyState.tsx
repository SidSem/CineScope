import React from 'react';
import { Film, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
  icon: Icon = Film
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-cinema-border bg-cinema-surface/40 my-6">
      <div className="w-16 h-16 rounded-2xl bg-brand-violet/10 border border-brand-violet/25 flex items-center justify-center text-brand-violet mb-4 shadow-cinema-glow">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold font-display text-cinema-text mb-2">
        {title}
      </h3>
      <p className="text-sm text-cinema-muted max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-violet to-brand-pink text-white hover:opacity-95 shadow-cinema-glow transition-all active:scale-95"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-violet to-brand-pink text-white hover:opacity-95 shadow-cinema-glow transition-all active:scale-95"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
};
