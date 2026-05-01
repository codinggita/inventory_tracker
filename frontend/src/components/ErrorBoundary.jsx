import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            p: 3,
            bgcolor: '#f8fafc'
          }}
        >
          <AlertTriangle size={64} color="#ef4444" style={{ marginBottom: '24px' }} />
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Oops! Something went wrong.
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4} maxWidth="500px">
            We encountered an unexpected error. Please try refreshing the page or contact support if the issue persists.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.reload()}
            sx={{ px: 4, py: 1.5, borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
          >
            Refresh Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
