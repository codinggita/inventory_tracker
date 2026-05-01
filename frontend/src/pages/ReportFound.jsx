import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

import Button from '../components/Button';
import Input from '../components/Input';


import FileUpload from '../components/FileUpload';

const ReportFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || { name: 'Item' };
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call with file
    console.log('Uploading file:', file);
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
            <FileUpload onFileSelect={(f) => setFile(f)} />
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
