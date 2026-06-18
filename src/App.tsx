import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import AppMain from './AppMain';

type PageView = 'landing' | 'app';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageView);
  };

  return currentPage === 'landing' ? (
    <LandingPage onNavigate={handleNavigate} />
  ) : (
    <AppMain onNavigateToLanding={() => handleNavigate('landing')} />
  );
};

export default App;
