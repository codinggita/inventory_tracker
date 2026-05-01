import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../components/MainLayout';

import { useAuth } from '../hooks/useAuth';
import { useAppContext } from '../context/AppContext';
import { User, Mail, Shield, Calendar, Settings, Bell, CreditCard, Share2, LogOut, ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const { reservations } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Reservations', value: reservations.length, icon: <Calendar className="w-5 h-5" /> },
    { label: 'Member Since', value: 'Apr 2026', icon: <User className="w-5 h-5" /> },
    { label: 'Account Type', value: user?.role === 'admin' ? 'Admin' : 'Personal', icon: <Shield className="w-5 h-5" /> },
  ];

  const menuItems = [
    { label: 'Account Settings', icon: <Settings className="w-5 h-5" />, color: 'text-slate-600', bg: 'bg-slate-50' },
    { label: 'Notifications', icon: <Bell className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Payment Methods', icon: <CreditCard className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Invite Friends', icon: <Share2 className="w-5 h-5" />, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center md:items-end gap-8 bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
          
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-emerald-200 border-4 border-white">
              <User className="w-16 h-16 md:w-20 md:h-20" />
            </div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center text-emerald-600 border border-slate-50 cursor-pointer"
            >
              <Settings className="w-5 h-5" />
            </motion.div>
          </div>

          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{user?.name || 'Scout User'}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 font-bold">
                <Mail className="w-4 h-4" />
                <span>{user?.email || 'user@shelfscout.com'}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                {user?.role || 'User'}
              </span>
              <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                Verified Scout
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
              key={stat.label}
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-emerald-200 transition-colors"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-black text-slate-900 px-4">Account</h3>
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
              {menuItems.map((item) => (
                <button 
                  key={item.label}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <span className="font-bold text-slate-700">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-black text-slate-900 px-4">Support & More</h3>
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
              <button className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-700">Help Center</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </button>
              <button className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-700">Privacy Policy</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </button>
              <button 
                onClick={handleLogout}
                className="w-full p-6 flex items-center justify-between hover:bg-rose-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white text-rose-500 rounded-2xl flex items-center justify-center border border-rose-100 shadow-sm group-hover:bg-rose-500 group-hover:text-white transition-all">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-rose-600">Sign Out</span>
                </div>
                <ChevronRight className="w-5 h-5 text-rose-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
