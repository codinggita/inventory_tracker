import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

import Button from '../components/Button';
import Timer from '../components/Timer';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || 'Your reservation was successful!';
  const reservation = location.state?.reservation;
  const [isExpired, setIsExpired] = useState(false);
  const [expiryTime, setExpiryTime] = useState(null);

  useEffect(() => {
    if (reservation?.expiryTime) {
      setExpiryTime(reservation.expiryTime);
    } else {
      // Set fallback expiry to 10 minutes from now
      const time = new Date();
      time.setMinutes(time.getMinutes() + 10);
      setExpiryTime(time);
    }
  }, [reservation]);

  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-20 text-center space-y-8 animate-fade-in">
        {isExpired ? (
          <>
            <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900 leading-tight">Reservation Expired</h1>
              <p className="text-slate-500 text-lg leading-relaxed">
                Your 10-minute hold window has closed. The product has been returned to regular stock.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 animate-bounce">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2 flex flex-col items-center">
              <h1 className="text-4xl font-black text-slate-900 leading-tight">Success!</h1>
              <p className="text-slate-500 text-lg leading-relaxed mb-4">
                {message}
              </p>
              {expiryTime && (
                <div className="mt-6 flex flex-col items-center space-y-2">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Hold expires in:</p>
                  <Timer expiryTime={expiryTime} onExpire={() => setIsExpired(true)} />
                </div>
              )}
            </div>
          </>
        )}

        <Button 
          variant="primary" 
          className="w-full py-4 text-lg shadow-sm"
          onClick={() => navigate('/home')}
        >
          Return Home
        </Button>
      </div>
    </MainLayout>
  );
};

export default Success;
