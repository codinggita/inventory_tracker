import { useEffect, useRef } from 'react';

const MOCK_MODE = !import.meta.env.VITE_API_BASE_URL;

const useSocket = (onStockUpdate, onReservationUpdate) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Skip socket connection in mock mode — events are handled by mockApi event emitter
    if (MOCK_MODE) return;

    let io;
    try {
      io = require('socket.io-client').io;
    } catch {
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://127.0.0.1:5000';

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: false, // Don't repeatedly retry when backend is offline
      auth: { token: localStorage.getItem('token') }
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to Inventory Socket Server');
    });

    if (onStockUpdate) {
      socketRef.current.on('stock:update', onStockUpdate);
    }

    if (onReservationUpdate) {
      socketRef.current.on('reservation:update', onReservationUpdate);
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [onStockUpdate, onReservationUpdate]);

  const emitEvent = (eventName, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(eventName, data);
    }
  };

  return { emitEvent, socket: socketRef.current };
};

export default useSocket;
