import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

import Button from '../components/Button';

const ReportNotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || { name: 'Item' };
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    // Back to Frame 8 (Out of Stock)
    navigate('/out-of-stock', { state: { product } });
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto space-y-8 py-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 leading-tight">Report Missing</h1>
          <p className="text-gray-500">Confirm {product.name} is not on shelves.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-left">
          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-700">Reason for reporting:</p>
            {['Shelf is empty', 'Price tag missing', 'Wrong item in place'].map((reason) => (
              <label key={reason} className="flex items-center space-x-3 p-4 border border-gray-100 rounded-2xl hover:bg-red-50 hover:border-red-100 transition-colors cursor-pointer group">
                <input type="radio" name="reason" className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300" required />
                <span className="font-medium text-gray-700 group-hover:text-red-700">{reason}</span>
              </label>
            ))}
          </div>
          <Button type="submit" variant="danger" className="w-full py-4 bg-red-600 hover:bg-red-700" loading={loading}>
            Confirm Not Found
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default ReportNotFound;
