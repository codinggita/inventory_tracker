import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'sonner';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <SearchProvider>
            <Router>
              <div className="min-h-screen bg-slate-50">
                <AppRoutes />
                <Toaster position="top-center" richColors />
              </div>
            </Router>
          </SearchProvider>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
