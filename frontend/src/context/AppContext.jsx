import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserLocation } from '../hooks/useLocation';
import { toast } from 'sonner';
import { io } from 'socket.io-client';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { location, error, loading } = useUserLocation();
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('shelf_scout_reservations');
    return saved ? JSON.parse(saved) : [];
  });
  const [realTimeStock, setRealTimeStock] = useState({});
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist'); // Fixed key consistency
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('shelf_scout_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shelf_scout_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('shelf_scout_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const socket = io('http://127.0.0.1:5000');

    socket.on('stockUpdate', ({ productId, storeId, newStock }) => {
      setRealTimeStock(prev => ({
        ...prev,
        [`${productId}-${storeId}`]: newStock
      }));

      // Stock notification logic
      if (newStock > 0) {
        setNotifications(prev => {
          const productNotifs = prev.filter(n => n.productId === productId && !n.read);
          if (productNotifs.length > 0) {
            return [createNotif({
              type: 'stock',
              icon: '📦',
              title: 'Back in Stock!',
              message: `A product in your watchlist is now available (${newStock} units).`,
              productId,
            }), ...prev];
          }
          return prev;
        });
      }
    });

    socket.on('notification', (data) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id === data.userId) {
        pushNotif({
          type: data.type || 'info',
          icon: data.type === 'success' ? '✅' : 'ℹ️',
          title: 'System Notification',
          message: data.message,
          recipientRole: 'user'
        });
        toast[data.type || 'info'](data.message);
      }
    });

    const handleStorageChange = (e) => {
      if (e.key === 'shelf_scout_reservations') {
        setReservations(e.newValue ? JSON.parse(e.newValue) : []);
      }
      if (e.key === 'shelf_scout_notifications') {
        setNotifications(e.newValue ? JSON.parse(e.newValue) : []);
      }
      if (e.key === 'wishlist') {
        setWishlist(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      socket.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const [userFriendlyLocation, setUserFriendlyLocation] = useState('Detecting...');

  useEffect(() => {
    if (location) {
      if (location.lat >= 23.2 && location.lat <= 23.3 && location.lng >= 72.4 && location.lng <= 72.6) {
        setUserFriendlyLocation('Swaminarayan University, Kalol');
      } else {
        setUserFriendlyLocation('Unknown Location');
      }
    }
  }, [location]);

  const createNotif = (fields) => ({
    id: Date.now() + Math.random(),
    read: false,
    timestamp: new Date().toISOString(),
    recipientRole: 'user',
    ...fields,
  });

  const pushNotif = (fields) => {
    setNotifications(prev => [createNotif(fields), ...prev]);
  };

  const addReservation = (res) => {
    setReservations(prev => [...prev, res]);
    pushNotif({
      type: 'reservation',
      icon: '✅',
      title: 'Reservation Created',
      message: `You reserved "${res.product?.name || 'a product'}". It will be held for 10 minutes.`,
      recipientRole: 'user'
    });
  };

  const cancelReservation = (id) => {
    const res = reservations.find(r => r.id === id);
    setReservations(prev => prev.filter(r => r.id !== id));
    pushNotif({
      type: 'cancellation',
      icon: '🚫',
      title: 'Reservation Cancelled',
      message: `Your reservation for "${res?.product?.name || 'a product'}" was cancelled.`,
      recipientRole: 'user'
    });
  };

  const confirmReservationByAdmin = (id, productName = 'your product') => {
    setReservations(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'confirmed', expiryTime: null } : r
    ));
    pushNotif({
      type: 'confirmation',
      icon: '🎉',
      title: 'Reservation Confirmed',
      message: `Your reservation for "${productName}" has been confirmed. Visit the store to collect it.`,
      recipientRole: 'user'
    });
    toast.success(`Confirmed: ${productName}`);
  };

  const rejectReservation = (id, productName = 'your product', reason = '') => {
    setReservations(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'rejected', expiryTime: null } : r
    ));
    pushNotif({
      type: 'rejection',
      icon: '❌',
      title: 'Reservation Rejected',
      message: `Your reservation for "${productName}" was rejected.${reason ? ` Reason: ${reason}` : ''}`,
      recipientRole: 'user'
    });
    toast.error(`Rejected: ${productName}`);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => setNotifications([]);

  return (
    <AppContext.Provider value={{
      location,
      userFriendlyLocation,
      locationError: error,
      locationLoading: loading,
      reservations,
      realTimeStock,
      wishlist,
      notifications,
      unreadCount: notifications.filter(n => !n.read).length,
      toggleWishlist,
      markNotificationRead,
      markAllRead,
      clearNotifications,
      addReservation,
      cancelReservation,
      confirmReservationByAdmin,
      rejectReservation,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
