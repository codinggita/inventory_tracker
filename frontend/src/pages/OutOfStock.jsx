import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

import Button from '../components/Button';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';


const OutOfStock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || { name: 'This Product', category: 'All' };
  const [substitutes, setSubstitutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubstitutes = async () => {
      try {
        const results = await productService.searchProducts(product.category);
        // Filter out the current product and only keep those with stock
        const filtered = results
          .filter(p => p.id !== product.id && p.stock > 0)
          .slice(0, 3);
        setSubstitutes(filtered);
      } catch (err) {
        console.error('Failed to fetch substitutes');
      } finally {
        setLoading(false);
      }
    };

    fetchSubstitutes();
  }, [product]);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12 space-y-12">
        <div className="max-w-md mx-auto text-center space-y-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
              Sold Out
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">Out of Stock</h1>
            <p className="text-slate-500 text-lg font-medium">
              We're sorry, <span className="font-black text-slate-900">{product.name}</span> is currently unavailable at this store.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              variant="primary" 
              className="w-full py-4 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-100"
              onClick={() => navigate('/notify', { state: { product } })}
            >
              Notify Me When Back
            </Button>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="border-slate-200 text-slate-600 text-sm font-bold"
                onClick={() => navigate('/report-not-found', { state: { product } })}
              >
                Report Not Found
              </Button>
              <Button 
                variant="secondary" 
                className="text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
                onClick={() => navigate('/search')}
              >
                Search Others
              </Button>
            </div>
          </div>
        </div>

        {substitutes.length > 0 && (
          <div className="space-y-6 pt-12 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Smart Substitutes</h2>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Available Now</span>
            </div>
            <p className="text-slate-500 font-medium -mt-4 italic">Available alternatives in the same category</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {substitutes.map(sub => (
                <ProductCard key={sub.id} product={sub} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OutOfStock;
