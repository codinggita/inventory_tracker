import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';

import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCard';

import { ProductCardSkeleton } from '../../components/Skeleton';
import productService from '../../services/productService';
import { useAppContext } from '../../context/AppContext';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { location } = useAppContext();

  const categories = ['All', 'Electronics', 'Home Appliances', 'Clothing', 'Sports', 'Gaming'];

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      // Use "All" as empty query if no searchTerm
      const query = selectedCategory === 'All' ? searchTerm : selectedCategory;
      const data = await productService.searchProducts(query, location);
      
      // If we have both a category AND a searchTerm, further filter locally for precision
      let filteredData = data;
      if (selectedCategory !== 'All' && searchTerm) {
        filteredData = data.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          p.brand.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setProducts(filteredData);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, location]);

  const handleSearch = () => {
    fetchProducts();
  };

  const handleReserved = (reservationData) => {
    // Global state is already updated via context inside ReserveButton
    console.log('Product reserved:', reservationData);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Discover Products</h1>
            <p className="text-slate-500 font-medium mt-1">Real-time inventory visibility across all stores</p>
          </div>
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            onSearch={handleSearch} 
          />
        </div>

        {/* Category Selection Chips */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">Categories:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105'
                  : 'bg-white text-slate-600 border border-slate-100 hover:border-emerald-200 hover:text-emerald-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-[32px] text-center font-bold border border-red-100 animate-shake">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">No products found</h3>
            <p className="mt-2 text-slate-500 font-medium">Try adjusting your search terms or changing the category.</p>
            <button 
              onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}
              className="mt-8 text-emerald-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onReserved={handleReserved} 
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
