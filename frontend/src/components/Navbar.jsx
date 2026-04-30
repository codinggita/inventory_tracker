import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

import Button from './Button';
import NotificationBell from './NotificationBell';

import { Menu, X, LogOut, User, LayoutDashboard, Search, ShoppingBag, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useAppContext();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'dealer';

  const navLinks = user ? [
    { 
      label: 'Dashboard', 
      path: isAdmin ? '/admin' : '/dashboard', 
      icon: <LayoutDashboard className="w-4 h-4" /> 
    },
    ...(!isAdmin ? [
      { label: 'Find Products', path: '/search', icon: <Search className="w-4 h-4" /> },
      { label: 'My Reservations', path: '/reservations', icon: <ShoppingBag className="w-4 h-4" /> },
    ] : [
      { label: 'Manage Inventory', path: '/admin/inventory', icon: <Settings className="w-4 h-4" /> },
      { label: 'Customer Holds', path: '/reservations', icon: <ShoppingBag className="w-4 h-4" /> },
    ]),
  ] : [];

  return (
    <nav className="glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-200">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-gradient tracking-tighter">
              Shelf Scout
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <div className="flex items-center space-x-6">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.path}
                      to={link.path} 
                      className="flex items-center space-x-2 text-slate-600 hover:text-emerald-600 font-bold transition-all hover:scale-105"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>

                <div className="h-6 w-px bg-slate-200" />

                <NotificationBell />

                <div className="flex items-center space-x-4 pl-4 border-l border-slate-100">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => navigate('/profile')}
                  >
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-slate-900 leading-none mb-1">{user.name || 'User'}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{user.role}</p>
                    </div>
                  </motion.div>
                  
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="p-2.5 border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all rounded-xl"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-600 hover:text-emerald-600 font-bold transition-colors">Login</Link>
                <Link to="/signup">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {user && <NotificationBell />}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl mb-6">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  
                  {navLinks.map((link) => (
                    <Link 
                      key={link.path}
                      to={link.path} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-4 p-4 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl font-bold transition-all"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-4 p-4 text-red-600 hover:bg-red-50 rounded-2xl font-bold transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-4 text-center text-slate-600 font-bold bg-slate-50 rounded-2xl"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-4 text-center text-white font-bold bg-emerald-600 rounded-2xl"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
