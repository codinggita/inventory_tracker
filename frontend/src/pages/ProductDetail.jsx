import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import MainLayout from '../components/MainLayout';

import Button from '../components/Button';
import ReserveButton from '../components/ReserveButton';

import { formatCurrency } from '../utils/formatters';
import { ProductDetailSkeleton } from '../components/Skeleton';
import productService from '../services/productService';
import { useAppContext } from '../context/AppContext';
import { Heart, Star, ShieldCheck, Truck, RotateCcw, ArrowLeft, MapPin, Store, Check } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { location, toggleWishlist, wishlist } = useAppContext();
  const [product, setProduct] = useState(null);
  const [availableStores, setAvailableStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isWishlisted = wishlist.some(p => p.id === parseInt(id));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const prod = await productService.getProductById(id);
        const stores = await productService.getProductStores(id, location);
        setProduct(prod);
        setAvailableStores(stores);
        if (stores.length > 0) {
          setSelectedStore(stores[0]);
        }
      } catch (err) {
        setError('Product not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, location]);

  const handleWishlist = () => {
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success('Added to wishlist', {
        icon: <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
      });
    } else {
      toast.info('Removed from wishlist');
    }
  };

  if (loading) return <MainLayout><ProductDetailSkeleton /></MainLayout>;
  if (error) return <MainLayout><div className="text-center py-32 text-red-600 font-black text-2xl">{error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-500 hover:text-emerald-600 font-black transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative group"
          >
            <div className="bg-white rounded-[60px] p-12 md:p-20 border border-slate-100 shadow-2xl flex items-center justify-center min-h-[500px] md:min-h-[650px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent pointer-events-none" />
              <motion.img 
                layoutId={`product-image-${id}`}
                src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"} 
                alt={product.name}
                className="max-h-[450px] object-contain relative z-10"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                className={`absolute top-12 right-12 w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all duration-300 z-20 ${
                  isWishlisted ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-white text-slate-400 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-8 h-8 ${isWishlisted ? 'fill-white' : ''}`} />
              </motion.button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-white rounded-3xl border border-slate-100 p-4 flex items-center justify-center cursor-pointer hover:border-emerald-300 transition-colors shadow-sm">
                   <img src={product.image} alt="" className="max-h-full object-contain opacity-50 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="px-5 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border border-emerald-100">
                  {product.category}
                </span>
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 shadow-sm">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-black text-amber-700">{product.rating}</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">{product.name}</h1>
              <div className="flex items-end gap-6">
                <p className="text-5xl font-black text-emerald-600 tracking-tight">{formatCurrency(product.price)}</p>
                <p className="text-slate-400 font-bold mb-1">Tax included</p>
              </div>
            </div>

            <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-4">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-emerald-600" />
                 Scout Insight
               </h3>
               <p className="text-slate-600 leading-relaxed text-lg font-medium">
                 {product.description || `Experience the next level of excellence with ${product.brand}. This ${product.category.toLowerCase()} offers unmatched performance and build quality, verified by our real-time inventory network.`}
               </p>
            </div>

            {/* Multistore Selection */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Available Nearby</h3>
                <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">{availableStores.length} Stores Found</span>
              </div>
              <div className="grid gap-4">
                {availableStores.map((store) => (
                  <motion.div 
                    key={store.id}
                    whileHover={{ scale: 1.01, x: 5 }}
                    onClick={() => setSelectedStore(store)}
                    className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all flex items-center justify-between ${
                      selectedStore?.id === store.id 
                        ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-100' 
                        : 'bg-white border-slate-100 hover:border-emerald-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedStore?.id === store.id ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-400'
                      }`}>
                        <Store className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg">{store.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-slate-500 font-bold text-sm">
                            <MapPin className="w-4 h-4" />
                            {store.distance}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className={`font-black text-sm uppercase tracking-widest ${
                            store.stock > 10 ? 'text-emerald-600' : 'text-amber-600'
                          }`}>
                            {store.stock} In Stock
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedStore?.id === store.id && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-emerald-600 text-white p-2 rounded-full shadow-lg shadow-emerald-200"
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-slate-100">
               <ReserveButton 
                 product={{...product, storeId: selectedStore?.id, storeName: selectedStore?.name, stock: selectedStore?.stock}} 
                 disabled={!selectedStore || selectedStore.stock <= 0}
               />
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-600">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm">Instant Pickup</p>
                  <p className="text-xs text-slate-400 font-bold mt-1">Ready in 10 minutes</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-600">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm">Verified Stock</p>
                  <p className="text-xs text-slate-400 font-bold mt-1">Real-time tracking</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
