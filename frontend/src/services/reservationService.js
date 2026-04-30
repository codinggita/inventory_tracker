import BASE_URL from './apiConfig';

const reservationService = {
  createReservation: async (productId, storeId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    const res = await fetch(`${BASE_URL}/reserve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, storeId, userId })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Reservation failed');
    }

    return await res.json();
  },
  
  getMyReservations: async () => {
    const res = await fetch(`${BASE_URL}/reservations`);
    if (!res.ok) throw new Error('Failed to fetch reservations');
    const all = await res.json();
    
    const user = JSON.parse(localStorage.getItem('user'));
    return all.filter(r => r.userId === user?.id);
  },
  
  cancelReservation: async (id) => {
    return { success: true };
  },
  
  confirmReservation: async (id) => {
    const res = await fetch(`${BASE_URL}/reservations/${id}/confirm`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to confirm reservation');
    return await res.json();
  }
};

export default reservationService;
