import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Handle pending business verification
  if (user.role === 'pendingDealer') {
    return <Navigate to="/verification-pending" replace />;
  }

  // Admin/Dealer trying to access user-only routes → send to admin panel
  if (userOnly && (user.role === 'admin' || user.role === 'dealer')) {
    return <Navigate to="/admin" replace />;
  }

  // Non-admin trying to access admin-only routes → send to user dashboard
  if (adminOnly && (user.role !== 'admin' && user.role !== 'dealer')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
