import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { 
      path: '/home', 
      label: 'Home', 
      icon: (
        <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      ) 
    },
    { 
      path: '/map', 
      label: 'Map', 
      icon: (
        <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
        </svg>
      ) 
    },
    { 
      path: '/reports', 
      label: 'Reports', 
      icon: (
        <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      ) 
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: (
        <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ) 
    }
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-slate-100 pb-safe pt-2 px-6 flex justify-between items-center z-50 rounded-t-[24px] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path) || (location.pathname === '/' && item.path === '/home');
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center p-2 min-w-[64px] transition-colors ${
              isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {isActive ? (
              <div className="bg-emerald-50 text-emerald-600 p-2 rounded-2xl w-14 flex flex-col items-center">
                {item.icon}
                <span className="text-[10px] font-bold mt-1">{item.label}</span>
              </div>
            ) : (
              <>
                {item.icon}
                <span className="text-[10px] font-bold mt-1">{item.label}</span>
              </>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
