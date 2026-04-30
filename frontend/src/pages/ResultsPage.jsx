import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../components/MainLayout';

import ProductCard from '../components/ProductCard';

import Loader from '../components/Loader';
import Button from '../components/Button';
import { useSearch } from '../context/SearchContext';
import { useAppContext } from '../context/AppContext';
import productService from '../services/productService';
import { ProductCardSkeleton } from '../components/Skeleton';
import { Map, Search, ArrowLeft, Filter } from 'lucide-react';

const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { results, updateSearch, setSelectedProduct } = useSearch();
  const { location } = useAppContext();
  const [loading, setLoading] = React.useState(true);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await productService.searchProducts(query, location);
        updateSearch(query, data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, location]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    if (product.stock > 0) {
      navigate(`/product/${product.id}`);
    } else {
      navigate('/out-of-stock', { state: { product } });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <MainLayout>
      <div className="space-y-12 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-4xl font-black text-slate-900 leading-none mb-2">
                {results.length} results found
              </h1>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 font-medium">Searching for</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-sm">"{query}"</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="px-6 py-3 text-sm border-slate-200 font-bold flex items-center space-x-2 hover:bg-slate-50"
              onClick={() => navigate('/map')}
            >
              <Map className="w-4 h-4" />
              <span>View on Map</span>
            </Button>
            <Button 
              variant="outline" 
              className="px-6 py-3 text-sm border-slate-200 font-bold flex items-center space-x-2 hover:bg-slate-50"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-100 space-y-6"
          >
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <Search className="w-12 h-12" />
             </div>
             <div className="space-y-2">
               <p className="text-2xl font-black text-slate-900">No products found</p>
               <p className="text-slate-500 max-w-xs mx-auto font-medium">Try searching for something else or check your spelling.</p>
             </div>
             <Button 
              variant="primary" 
              onClick={() => navigate('/home')}
              className="px-12"
             >
               Back to Home
             </Button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {results.map(p => (
              <motion.div 
                key={p.id} 
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 }
                }}
                onClick={(e) => {
                  if (!e.target.closest('button') && !e.target.closest('.timer-container')) {
                    handleProductClick(p);
                  }
                }} 
                className="cursor-pointer"
              >
                <ProductCard 
                  product={p} 
                  onReserved={() => {}}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default ResultsPage;
