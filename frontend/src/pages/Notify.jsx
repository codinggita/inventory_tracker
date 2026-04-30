import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

import Button from '../components/Button';
import NotificationToggle from '../components/NotificationToggle';

import { useAppContext } from '../context/AppContext';

const Notify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || { name: 'Item', id: null };
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({ push: true, email: false });
  const { addNotification } = useAppContext();

  const handleSetup = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    
    // Register a "Stock Monitor" notification
    addNotification({
      type: 'monitor',
      productId: product.id,
      title: 'Monitor Active',
      message: `We'll notify you when ${product.name} is back in stock.`
    });

    setLoading(false);
    navigate('/success', { 
      state: { 
        title: 'Monitor Active!',
        message: `We've set up a real-time monitor for ${product.name}. You'll be the first to know when it's back in stock.`
      } 
    });
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-12 space-y-10">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[32px] flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-100 rotate-3">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Stay Alert</h1>
            <p className="text-slate-500 font-medium px-4">
              Get notified immediately when <span className="text-emerald-600 font-bold">{product.name}</span> returns to inventory.
            </p>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl space-y-8">
          <div className="space-y-4">
            <NotificationToggle 
              label="Push Notifications"
              description="Receive instant alerts on your device"
              initialValue={settings.push}
              onToggle={(val) => setSettings({...settings, push: val})}
            />
            <NotificationToggle 
              label="Email Notifications"
              description="Daily stock updates and availability reports"
              initialValue={settings.email}
              onToggle={(val) => setSettings({...settings, email: val})}
            />
          </div>

          <div className="pt-4 space-y-4">
            <Button 
              variant="primary" 
              className="w-full py-5 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
              onClick={handleSetup}
              loading={loading}
            >
              Start Monitoring
            </Button>
            <button 
              onClick={() => navigate(-1)}
              className="w-full py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Notify;
