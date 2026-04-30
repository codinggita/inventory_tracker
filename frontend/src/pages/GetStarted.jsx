import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 max-w-sm">
        <div className="w-64 h-64 bg-emerald-50 rounded-full flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1586769852044-692d6e38a254?auto=format&fit=crop&q=80&w=300" 
            alt="Search Inventory"
            className="w-48 h-48 object-contain mix-blend-multiply"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Never miss a product again</h2>
          <p className="mt-4 text-gray-500">
            Check store inventory in real-time and reserve items before they sell out.
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <Button 
          variant="primary" 
          className="w-full py-4 text-lg"
          onClick={() => navigate('/login')}
        >
          Get Started
        </Button>
        <p className="text-center text-sm text-gray-400">
          Join 50,000+ users tracking inventory daily
        </p>
      </div>
    </div>
  );
};

export default GetStarted;
