'use client';

import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 min-h-screen pt-16 lg:pt-0">
      <div className="p-4 lg:p-6">
        {children}
      </div>
    </main>
  );
};

export default MainContent;