import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { FilterState } from '../../types/movie';
import { FilterPanel } from './FilterPanel';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  totalResults
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-h-[85vh] flex flex-col rounded-t-3xl bg-cinema-surface border-t border-cinema-border shadow-2xl text-cinema-text z-10"
            role="dialog"
            aria-label="Filter Movies"
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 rounded-full bg-cinema-muted/30 mx-auto mt-3 mb-1" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-cinema-border">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-brand-violet" />
                <h3 className="font-display font-bold text-lg">
                  Filters & Sorting
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-cinema-muted hover:text-cinema-text hover:bg-cinema-subtle"
                aria-label="Close filters drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              <FilterPanel
                filters={filters}
                onChange={onChange}
                onReset={onReset}
                className="border-0 shadow-none p-0 bg-transparent"
              />
            </div>

            {/* Sticky Footer */}
            <div className="p-4 border-t border-cinema-border bg-cinema-surface flex items-center gap-3">
              <button
                type="button"
                onClick={onReset}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-cinema-muted hover:text-cinema-text bg-cinema-elevated border border-cinema-border flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-[2] py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-violet to-brand-pink shadow-cinema-glow flex items-center justify-center"
              >
                Show {totalResults} Films
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
