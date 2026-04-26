import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../components/MainLayout';

import SearchBar from '../components/SearchBar';
import { useSearch } from '../context/SearchContext';
import { useAppContext } from '../context/AppContext';
import { Laptop, Phone, Speaker, Gamepad2, MapPin } from 'lucide-react';

const Home = () => {
  const { query, updateSearch } = useSearch();
  const { location, locationLoading, userFriendlyLocation } = useAppContext();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/results?q=${encodeURIComponent(query)}`);
    }
  };

  const handleCategoryClick = (cat) => {
    updateSearch(cat, []);
    navigate(`/results?q=${cat}`);
  };

  const categories = [
    { name: 'Laptops', icon: <Laptop className="w-6 h-6" /> },
    { name: 'Phones', icon: <Phone className="w-6 h-6" /> },
    { name: 'Audio', icon: <Speaker className="w-6 h-6" /> },
    { name: 'Gaming', icon: <Gamepad2 className="w-6 h-6" /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <MainLayout>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-12 px-4 py-12"
      >
        <motion.div variants={itemVariants} className="space-y-6 w-full max-w-3xl">
          <div className="flex justify-center mb-8">
             {locationLoading ? (
               <div className="h-8 w-40 bg-slate-200 animate-pulse rounded-full"></div>
             ) : location ? (
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold shadow-sm border border-emerald-100"
               >
                 <MapPin className="w-4 h-4" />
                 <span>{userFriendlyLocation || 'Near you'}</span>
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               </motion.div>
             ) : (
               <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-500 rounded-full text-sm font-bold border border-slate-200">
                 <MapPin className="w-4 h-4" />
                 <span>Location disabled</span>
               </div>
             )}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Find what you need, <br />
            <span className="text-gradient underline decoration-emerald-200 underline-offset-8">Instantly.</span>
          </h1>
          <p className="text-slate-500 text-xl max-w-xl mx-auto font-medium leading-relaxed">
            Real-time inventory intelligence across every store in the city. 
            Search, reserve, and pick up in minutes.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full max-w-2xl">
          <SearchBar 
            value={query}
            onChange={(val) => updateSearch(val, [])}
            onSearch={handleSearch}
          />
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl"
        >
          {categories.map((cat) => (
            <motion.button 
              key={cat.name}
              whileHover={{ scale: 1.05, translateY: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(cat.name)}
              className="group p-8 bg-white border border-slate-200 rounded-[32px] shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all flex flex-col items-center space-y-4"
            >
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                {cat.icon}
              </div>
              <span className="text-base font-bold text-slate-700 group-hover:text-emerald-700">{cat.name}</span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default Home;


