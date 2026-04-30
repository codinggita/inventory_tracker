import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import MapContainer from '../components/MapContainer';
import Button from '../components/Button';
import { useAppContext } from '../context/AppContext';
import productService from '../services/productService';

const MapView = () => {
  const navigate = useNavigate();
  const { location } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('Electronics');
  const [storesWithStock, setStoresWithStock] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = ['Electronics', 'Home Appliances', 'Clothing', 'Sports', 'Gaming'];

  const fetchNearbyStores = async () => {
    setLoading(true);
    try {
      // Use productService to search by category and pass location for distance sorting
      const productsInCategory = await productService.searchProducts(selectedCategory, location);
      
      const storeMap = {};
      productsInCategory.forEach(product => {
        if (product.storeId && product.stock > 0) {
          if (!storeMap[product.storeId]) {
            storeMap[product.storeId] = {
              id: product.storeId,
              name: product.storeName,
              lat: product.lat,
              lng: product.lng,
              distance: product.distance,
              products: [],
              totalStock: 0
            };
          }
          storeMap[product.storeId].products.push(product);
          storeMap[product.storeId].totalStock += product.stock;
        }
      });

      const results = Object.values(storeMap).map(store => ({
        ...store,
        travelTime: store.distance ? Math.round((store.distance / 20) * 60) : null
      }));

      results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      setStoresWithStock(results);
    } catch (error) {
      console.error('Error fetching map data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyStores();
  }, [selectedCategory, location]);

  const handleStoreSelect = (store) => {
    navigate('/results', { state: { storeId: store.id, category: selectedCategory } });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Nearby</h1>
            <p className="text-slate-500 font-medium">Find shops based on what you're looking for</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setStoresWithStock([]);
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  selectedCategory === cat 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105' 
                    : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-250px)]">
          <div className="lg:col-span-2 relative rounded-[40px] overflow-hidden border-8 border-white shadow-2xl bg-slate-100">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
              </div>
            ) : null}
            <MapContainer stores={storesWithStock} onSelectStore={handleStoreSelect} />
          </div>

          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-xl font-bold text-slate-900 px-2">Nearby {selectedCategory} Stores</h2>
            {storesWithStock.length === 0 && !loading ? (
              <div className="p-8 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                <p className="text-slate-500">No stores found with {selectedCategory} in stock near you.</p>
              </div>
            ) : (
              storesWithStock.map(store => (
                <div 
                  key={store.id} 
                  className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all cursor-pointer group animate-fade-in"
                  onClick={() => handleStoreSelect(store)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{store.name}</h3>
                    <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase">
                      {store.totalStock} items
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm font-medium">
                    <div className="flex items-center text-slate-600">
                      <svg className="w-4 h-4 mr-1 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {store.distance || '?'} miles
                    </div>
                    <div className="flex items-center text-slate-600">
                      <svg className="w-4 h-4 mr-1 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {store.travelTime || '?'} mins away
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="primary" className="flex-1 py-2 text-xs">Browse Stock</Button>
                    <button 
                      className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`, '_blank');
                      }}
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MapView;
