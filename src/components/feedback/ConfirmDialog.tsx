import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-desc"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md p-6 rounded-2xl cinema-glass border border-cinema-border shadow-2xl bg-cinema-surface text-cinema-text z-10"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl flex-shrink-0 ${
                  isDestructive
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                    : 'bg-brand-violet/10 text-brand-violet border border-brand-violet/20'
                }`}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 id="confirm-dialog-title" className="text-lg font-bold font-display">
                  {title}
                </h3>
                <p id="confirm-dialog-desc" className="text-sm text-cinema-muted mt-1.5 leading-relaxed">
                  {message}
                </p>
              </div>

              <button
                onClick={onCancel}
                className="text-cinema-muted hover:text-cinema-text p-1.5 rounded-lg hover:bg-cinema-subtle transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-cinema-muted hover:text-cinema-text hover:bg-cinema-subtle border border-cinema-border transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-lg transition-all active:scale-95 ${
                  isDestructive
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-900/30'
                    : 'bg-gradient-to-r from-brand-violet to-brand-pink hover:opacity-90 shadow-cinema-glow'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
