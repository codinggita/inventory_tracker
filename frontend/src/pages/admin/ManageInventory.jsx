import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import BASE_URL from '../../services/apiConfig';
import productService from '../../services/productService';

const ManageInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStore, setFilterStore] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [invRes, storeRes, productRes] = await Promise.all([
          fetch(`${BASE_URL}/inventory`),
          fetch(`${BASE_URL}/stores`),
          fetch(`${BASE_URL}/products`)
        ]);
        
        const invData = await invRes.json();
        const storeData = await storeRes.json();
        const productData = await productRes.json();

        setInventory(invData);
        setStores(storeData);
        setProducts(productData);
      } catch (err) {
        console.error('Failed to load inventory data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStockUpdate = async (productId, storeId, newStock) => {
    const stockInt = parseInt(newStock);
    if (isNaN(stockInt)) return;

    setUpdatingId(`${productId}-${storeId}`);
    try {
      await productService.updateStock(productId, storeId, stockInt);
      setInventory(prev => prev.map(item => 
        (item.productId === productId && item.storeId === storeId) 
          ? { ...item, stock: stockInt } 
          : item
      ));
    } catch (err) {
      console.error('Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInventory = inventory.filter(item => 
    filterStore === 'all' || item.storeId === parseInt(filterStore)
  ).map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId),
    store: stores.find(s => s.id === item.storeId)
  })).filter(item => item.product);

  return (
    <MainLayout>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Inventory Control</h1>
            <p className="text-slate-500 font-bold mt-1">Manage stock levels across your retail network</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-xl">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest pl-4">Filter Store:</span>
            <select 
              className="bg-slate-50 border-none rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 transition-all outline-none py-2 px-4"
              value={filterStore}
              onChange={(e) => setFilterStore(e.target.value)}
            >
              <option value="all">All Locations</option>
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden animate-pulse">
            <div className="h-16 bg-slate-50 border-b border-slate-100"></div>
            <div className="p-10 space-y-6">
              {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-slate-50 rounded-2xl w-full"></div>)}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Product Intelligence</th>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Retail Location</th>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Quick Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredInventory.map((item) => {
                    const idKey = `${item.productId}-${item.storeId}`;
                    const isLow = item.stock < 5 && item.stock > 0;
                    const isOut = item.stock <= 0;

                    return (
                      <tr key={idKey} className="group hover:bg-emerald-50/40 transition-all">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                              <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-black text-slate-900">{item.product.name}</p>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{item.product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <p className="font-black text-slate-700 text-sm">{item.store.name}</p>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 whitespace-nowrap ${
                            isOut ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                            isLow ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                            'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                            {isOut ? 'Critical: Out' : isLow ? 'Warning: Low' : 'Healthy Stock'}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <input
                              type="number"
                              className={`w-24 px-4 py-2.5 bg-slate-50 border-2 rounded-xl text-center font-black outline-none transition-all focus:ring-4 focus:ring-emerald-500/10 ${
                                updatingId === idKey ? 'border-emerald-500 opacity-50' : 'border-slate-100 hover:border-slate-200 focus:border-emerald-500'
                              }`}
                              defaultValue={item.stock}
                              onBlur={(e) => handleStockUpdate(item.productId, item.storeId, e.target.value)}
                              disabled={updatingId === idKey}
                            />
                            {updatingId === idKey && (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent"></div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ManageInventory;
