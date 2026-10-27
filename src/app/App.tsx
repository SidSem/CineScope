import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { MobileNavigation } from '../components/layout/MobileNavigation';
import { Footer } from '../components/layout/Footer';

export const App: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-cinema-bg text-cinema-text selection:bg-brand-violet selection:text-white">
      {/* Top Header Navigation */}
      <AppHeader />

      {/* Main Page Route Content */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />

      {/* Bottom Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
};
