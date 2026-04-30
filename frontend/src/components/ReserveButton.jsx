import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Button from './Button';

import Timer from './Timer';
import { useAppContext } from '../context/AppContext';
import reservationService from '../services/reservationService';

import { CheckCircle2, Clock } from 'lucide-react';

const ReserveButton = ({ product, onReserved, disabled }) => {
  const [loading, setLoading] = useState(false);
  const { addReservation, reservations } = useAppContext();

  // Check if this product is already reserved
  const activeReservation = reservations.find(r => 
    r.productId === product.id && r.status === 'active'
  );

  const handleReserve = async () => {
    if (disabled || loading) return;
    
    setLoading(true);
    try {
      const resData = await reservationService.createReservation(product.id, product.storeId);
      
      // Enforce product details in the reservation object for UI display
      const fullResData = { ...resData, product };
      
      addReservation(fullResData);
      
      if (onReserved) onReserved(fullResData);
      toast.success('Product reserved successfully!', {
        description: `You have 10 minutes to pick up ${product.name}.`,
      });
    } catch (err) {
      toast.error(err.message || 'Failed to reserve product.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpire = () => {
    toast.info('Reservation expired', {
      description: `The reservation for ${product.name} has expired.`,
    });
  };

  if (activeReservation) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full flex items-center justify-between p-4 border-2 border-emerald-500 bg-emerald-50 rounded-2xl shadow-inner"
      >
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Reserved</span>
        </div>
        <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm border border-emerald-100">
          <Clock className="w-4 h-4 text-emerald-500" />
          <Timer expiryTime={activeReservation.expiryTime} onExpire={handleExpire} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        variant="primary"
        className="w-full py-4 text-lg font-bold rounded-2xl shadow-xl shadow-emerald-100"
        loading={loading}
        disabled={disabled || product.stock <= 0}
        onClick={handleReserve}
      >
        {product.stock <= 0 ? 'Out of Stock' : 'Reserve Now'}
      </Button>
    </motion.div>
  );
};

export default ReserveButton;
