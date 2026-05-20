import { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes/index.tsx';
import { Navbar, Footer, LoadingScreen, ScrollToTop } from './components/common/index.ts';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Define routes where we don't want global navbar/footer
  const isExcluded = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/user-dashboard') || 
    location.pathname.startsWith('/tradie-dashboard') ||
    location.pathname === '/login' ||
    location.pathname === '/join-now';

  return (
    <div className="min-h-screen flex flex-col bg-[#050f26] text-white">
      {!isExcluded && <Navbar />}
      <main className="flex-grow">
        <AppRoutes />
      </main>
      {!isExcluded && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
