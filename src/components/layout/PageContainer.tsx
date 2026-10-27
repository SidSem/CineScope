import React from 'react';
import { ToastContainer } from '../feedback/ToastContainer';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  maxWidth = '7xl'
}) => {
  const widthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <main
      className={`min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mx-auto w-full ${widthClasses[maxWidth]} ${className}`}
    >
      {children}
      <ToastContainer />
    </main>
  );
};
