import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

import ReserveButton from './ReserveButton';

import { formatCurrency } from '../utils/formatters';

import { MapPin, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, onReserved }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="premium-card overflow-hidden group"
    >
      <div className="h-64 bg-slate-100 relative overflow-hidden">
        <motion.img 
          src={product.image || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400`} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700"
          whileHover={{ scale: 1.1 }}
        />
        <div className="absolute top-4 right-4">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md border ${
            isOutOfStock 
              ? 'bg-red-500/90 text-white border-red-400' 
              : product.stock < 10
                ? 'bg-amber-500/90 text-white border-amber-400'
                : 'bg-emerald-500/90 text-white border-emerald-400'
          }`}>
            {isOutOfStock ? 'Out of Stock' : product.stock < 10 ? `Less Stock: ${product.stock} Left` : `${product.stock} Units Left`}
          </span>
        </div>
        
        {/* Quick action overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             whileHover={{ scale: 1 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-2xl"
           >
             <ShoppingBag className="w-6 h-6 text-emerald-600" />
           </motion.div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
              {product.name}
            </h3>
            <span className="text-2xl font-black text-gradient">{formatCurrency(product.price)}</span>
          </div>
          <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
            {product.description || 'Premium quality product with real-time stock tracking and instant reservation.'}
          </p>
        </div>

        <div className="flex items-center justify-between py-4 border-t border-slate-50">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-700">{product.storeName || 'Main Warehouse'}</span>
              <span className="text-xs text-slate-400 font-bold">{product.distance || '1.2 km away'}</span>
            </div>
          </div>
        </div>

        <ReserveButton 
          product={product}
          disabled={isOutOfStock}
          onReserved={onReserved}
        />
      </div>
    </motion.div>
  );
};

export default ProductCard;
