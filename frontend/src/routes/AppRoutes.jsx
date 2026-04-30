import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

import ProtectedRoute from './ProtectedRoute';
import AuthRoute from './AuthRoute';


// Lazy load pages for performance optimization
const GetStarted = lazy(() => import('../pages/GetStarted'));
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const BusinessVerification = lazy(() => import('../pages/auth/BusinessVerification'));
const VerificationPending = lazy(() => import('../pages/auth/VerificationPending'));
const AdminLogin = lazy(() => import('../pages/auth/AdminLogin'));
const Home = lazy(() => import('../pages/Home'));
const SearchPage = lazy(() => import('../pages/user/SearchPage'));
const ResultsPage = lazy(() => import('../pages/ResultsPage'));
const MapView = lazy(() => import('../pages/MapView'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const OutOfStock = lazy(() => import('../pages/OutOfStock'));
const ReportFound = lazy(() => import('../pages/ReportFound'));
const ReportNotFound = lazy(() => import('../pages/ReportNotFound'));
const Notify = lazy(() => import('../pages/Notify'));
const Profile = lazy(() => import('../pages/Profile'));
const Success = lazy(() => import('../pages/Success'));
const Dashboard = lazy(() => import('../pages/user/Dashboard'));
const Reservations = lazy(() => import('../pages/user/Reservations'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const ManageInventory = lazy(() => import('../pages/admin/ManageInventory'));

const RouteSkeleton = () => (
  <div className="min-h-screen bg-slate-50 p-8 flex flex-col space-y-4 animate-pulse">
    <div className="h-16 bg-white rounded-2xl w-full"></div>
    <div className="flex-1 flex gap-4">
      <div className="w-64 h-full bg-white rounded-2xl hidden md:block"></div>
      <div className="flex-1 bg-white rounded-2xl p-8">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-100 rounded w-full"></div>
          <div className="h-4 bg-slate-100 rounded w-5/6"></div>
          <div className="h-4 bg-slate-100 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  </div>
);

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<RouteSkeleton />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/get-started" element={<PageTransition><GetStarted /></PageTransition>} />
          
          {/* Auth */}
          <Route 
            path="/login" 
            element={
              <AuthRoute>
                <PageTransition><Login /></PageTransition>
              </AuthRoute>
            } 
          />
          <Route 
            path="/admin/login" 
            element={
              <AuthRoute>
                <PageTransition><AdminLogin /></PageTransition>
              </AuthRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <AuthRoute>
                <PageTransition><Signup /></PageTransition>
              </AuthRoute>
            } 
          />

          <Route path="/business-verification" element={<PageTransition><BusinessVerification /></PageTransition>} />
          <Route path="/verification-pending" element={<PageTransition><VerificationPending /></PageTransition>} />

          {/* Home, Dashboard & Search */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute userOnly={true}>
                <PageTransition><Dashboard /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <PageTransition><Reservations /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute userOnly={true}>
                <PageTransition><Home /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute userOnly={true}>
                <PageTransition><SearchPage /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <PageTransition><ResultsPage /></PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Product & Map */}
          <Route
            path="/map"
            element={
              <ProtectedRoute userOnly={true}>
                <PageTransition><MapView /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <PageTransition><ProductDetail /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/out-of-stock"
            element={
              <ProtectedRoute>
                <PageTransition><OutOfStock /></PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Reporting & Notifications */}
          <Route
            path="/report-found"
            element={
              <ProtectedRoute>
                <PageTransition><ReportFound /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-not-found"
            element={
              <ProtectedRoute>
                <PageTransition><ReportNotFound /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notify"
            element={
              <ProtectedRoute>
                <PageTransition><Notify /></PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Profile & Success */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PageTransition><Profile /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <PageTransition><Success /></PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <PageTransition><AdminDashboard /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute adminOnly={true}>
                <PageTransition><ManageInventory /></PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Default Redirect → Signup first */}
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="*" element={<Navigate to="/signup" replace />} />

        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export default AppRoutes;

