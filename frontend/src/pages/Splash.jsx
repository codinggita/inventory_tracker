import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Splash = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (user) {
          navigate('/home');
        } else {
          // The flow says Frame 3 (Login), but we have a Get Started screen (Frame 2C)
          // Usually splash goes to onboarding if never seen, or login.
          // Following the specific rule: If NOT logged in -> Frame 3 (Login)
          navigate('/login');
        }
      }, 2000); // 2 second delay for splash effect

      return () => clearTimeout(timer);
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-emerald-600 flex flex-col items-center justify-center text-white">
      <div className="animate-bounce mb-8">
        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h1 className="text-4xl font-black tracking-tighter">Shelf Scout</h1>
      <p className="mt-2 text-emerald-100 font-medium">Real-time inventory intelligence</p>
      
      <div className="absolute bottom-12">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
