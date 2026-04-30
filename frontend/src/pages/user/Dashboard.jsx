import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';

import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import productService from '../../services/productService';
import BASE_URL from '../../services/apiConfig';
import ProductCard from '../../components/ProductCard';

import { ArrowRight, Zap, TrendingUp, MapPin, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { reservations } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [nearbyStores, setNearbyStores] = useState([]);
  const navigate = useNavigate();

  // Redirect dealers/admins to their own dashboard
  useEffect(() => {
    if (user?.role === 'dealer' || user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const activeCount = reservations.filter(r => r.status === 'active').length;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const analyticsRes = await fetch(`${BASE_URL}/admin/analytics`);
        const analytics = await analyticsRes.json();
        
        const storeRes = await fetch(`${BASE_URL}/stores`);
        const stores = await storeRes.json();

        setTrending(analytics.popularProducts || []);
        setNearbyStores(stores.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-8 animate-pulse">
          <div className="h-64 bg-slate-200 rounded-[40px] w-full"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="h-32 bg-slate-100 rounded-3xl"></div>
                <div className="h-32 bg-slate-100 rounded-3xl"></div>
              </div>
              <div className="h-64 bg-slate-100 rounded-3xl"></div>
            </div>
            <div className="h-full bg-slate-100 rounded-3xl"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-16 py-8"
      >
        {/* Hero Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[48px] p-12 md:p-16 text-white shadow-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
          <div className="relative z-10 max-w-3xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-md rounded-full text-sm font-black uppercase tracking-widest mb-8 border border-white/10"
            >
              <Zap className="w-4 h-4 fill-emerald-300 text-emerald-300" />
              <span>Personal Scout Active</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8">
              Welcome back, <br/>
              <span className="text-emerald-300 italic">{user?.name}</span>
            </h1>
            <p className="opacity-90 text-xl md:text-2xl font-medium leading-relaxed mb-12 max-w-2xl">
              You have <span className="font-black underline decoration-emerald-400 decoration-4 underline-offset-8">{activeCount} active product reservations</span> today. Your scout is ready to explore more.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/search">
                <motion.button 
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white text-emerald-700 rounded-[24px] font-black text-xl hover:bg-emerald-50 transition-all shadow-2xl shadow-emerald-900/40 flex items-center group/btn"
                >
                  Scout Products
                  <ArrowRight className="w-6 h-6 ml-3 group-hover/btn:translate-x-2 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/reservations">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-emerald-500/10 backdrop-blur-md text-white border-2 border-white/30 rounded-[24px] font-black text-xl hover:bg-white/10 transition-all"
                >
                  View History
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-16">
            {/* Trending Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trending Now</h2>
                    <p className="text-slate-500 font-bold">Products everyone is reserving right now</p>
                  </div>
                </div>
                <Link to="/search" className="group flex items-center space-x-2 text-emerald-600 font-black hover:text-emerald-700 transition-colors">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {trending.slice(0, 3).map((p, idx) => (
                  <motion.div 
                    key={p.id}
                    variants={itemVariants}
                    custom={idx}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl flex items-center gap-6 group hover:border-orange-200 transition-all">
                <div className="bg-orange-50 p-6 rounded-2xl text-orange-600 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Stock Alerts</p>
                  <p className="text-3xl font-black text-slate-900">0 Items Low</p>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl flex items-center gap-6 group hover:border-emerald-200 transition-all">
                <div className="bg-emerald-50 p-6 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Active Scout</p>
                  <p className="text-3xl font-black text-slate-900">{activeCount} Reserved</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Nearby Stores */}
          <motion.aside 
            variants={itemVariants}
            className="space-y-8"
          >
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-xl shadow-slate-200/50">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Nearby Stores</h3>
              </div>
              
              <div className="space-y-6">
                {nearbyStores.map((store) => (
                  <motion.div 
                    key={store.id}
                    whileHover={{ x: 5 }}
                    className="group cursor-pointer"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        🏪
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{store.name}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">{store.distance || '?'} • {store.address || 'Local'}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <button className="w-full mt-10 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-emerald-50 hover:text-emerald-600 transition-all flex items-center justify-center space-x-2">
                <span>Explore Map</span>
                <MapPin className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-emerald-900 rounded-[40px] p-8 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
              <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
              <h3 className="text-lg font-black mb-6 relative z-10">Scout Safety</h3>
              <p className="text-emerald-100 text-sm font-medium leading-relaxed relative z-10">
                All reservations are held for 10 minutes. Please arrive on time to guarantee your items.
              </p>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Dashboard;
