import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

import Button from '../components/Button';
import Input from '../components/Input';


const ReportFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || { name: 'Item' };
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    navigate('/success', { state: { message: 'Thank you for reporting! Your contribution helps others find products.' } });
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto space-y-8 py-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 leading-tight">Report as Found</h1>
          <p className="text-gray-500">Confirm you've seen {product.name} in stock.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <Input 
            label="Store Section" 
            placeholder="e.g. Electronics Aisle 4"
            required
          />
          <Input 
            label="Estimated Quantity" 
            placeholder="e.g. 5+ items"
            type="number"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Add a Photo (Optional)</label>
            <div className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-400 transition-colors cursor-pointer">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-bold">Tap to upload</span>
            </div>
          </div>
          <Button type="submit" variant="primary" className="w-full py-4" loading={loading}>
            Submit Report
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default ReportFound;
