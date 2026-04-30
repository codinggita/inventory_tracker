import React, { createContext, useState, useContext, useCallback } from 'react';
import useSocket from '../hooks/useSocket';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reservationStatus, setReservationStatus] = useState('idle');

  const updateSearch = (q, res) => {
    setQuery(q);
    setResults(res);
  };

  const updateProductStock = (productId, newStock) => {

    setResults(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: newStock } : p
    ));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(prev => ({ ...prev, stock: newStock }));
    }
  };

  // Handle real-time stock updates from socket
  const handleStockUpdate = useCallback((data) => {
    // data expected: { productId, newStock }
    if (data && data.productId) {
      updateProductStock(data.productId, data.newStock);
    }
  }, [selectedProduct]);

  // Handle reservation updates
  const handleReservationUpdate = useCallback((data) => {
    console.log('Global reservation update:', data);
    setReservationStatus(data.status);
  }, []);

  const { emitEvent } = useSocket(handleStockUpdate, handleReservationUpdate);

  return (

    <SearchContext.Provider value={{ 
      query, 
      results, 
      updateSearch, 
      updateProductStock,
      selectedProduct, 
      setSelectedProduct,
      reservationStatus,
      setReservationStatus
    }}>

      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
