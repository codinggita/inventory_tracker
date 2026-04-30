import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, onSearch, placeholder }) => {
  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative group max-w-2xl w-full"
    >
      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
        <Search className="h-6 w-6 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
      </div>
      <input
        type="text"
        className="block w-full pl-16 pr-32 py-5 bg-white border-2 border-slate-100 rounded-[24px] shadow-xl focus:ring-8 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-bold text-lg"
        placeholder={placeholder || "What are you looking for today?"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
      />
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSearch}
        className="absolute inset-y-3 right-3 px-8 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center space-x-2"
      >
        <span>Search</span>
      </motion.button>
    </motion.div>
  );
};

export default SearchBar;
