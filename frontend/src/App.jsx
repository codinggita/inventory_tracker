import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { SearchProvider } from './context/SearchContext';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'sonner';

import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAnalytics } from './hooks/useAnalytics';

function AnalyticsWrapper() {
  useAnalytics();
  return null;
}

function App() {
  const { theme: mode } = useSelector((state) => state.ui);

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563eb',
      },
      secondary: {
        main: '#7c3aed',
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 16,
    },
  });
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
      <AppProvider>
        <SearchProvider>
          <Router>
            <AnalyticsWrapper />
            <div className="min-h-screen bg-slate-50">
              <AppRoutes />
              <Toaster position="top-center" richColors />
            </div>
          </Router>
        </SearchProvider>
      </AppProvider>
    </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
