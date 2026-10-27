import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const ToastContainer: React.FC = () => {
  const toasts = useAppStore(state => state.toasts);
  const removeToast = useAppStore(state => state.removeToast);

  const getIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-brand-aqua flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-brand-pink flex-shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-brand-tangerine flex-shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-brand-violet flex-shrink-0" />;
    }
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl cinema-glass border border-cinema-border shadow-card-elevated backdrop-blur-xl bg-cinema-surface/95"
            role="status"
          >
            <div className="mt-0.5">{getIcon(toast.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-cinema-text leading-snug">
                {toast.title}
              </p>
              {toast.description && (
                <p className="text-xs text-cinema-muted mt-0.5 line-clamp-2">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-cinema-muted hover:text-cinema-text transition-colors p-1 rounded-lg hover:bg-cinema-subtle"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
