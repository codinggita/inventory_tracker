import { products, stores, inventory, reservations, analytics, searchHistory } from '../mock/data';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Haversine distance formula (in miles)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
};

// Event emitter simulation for real-time updates
const listeners = {
  'stock:update': [],
  'reservation:created': [],
  'reservation:expired': []
};

export const onEvent = (event, callback) => {
  if (listeners[event]) {
    listeners[event].push(callback);
  }
};

const emitEvent = (event, data) => {
  if (listeners[event]) {
    listeners[event].forEach(cb => cb(data));
  }
};

export const getStores = async () => {
  await delay(100);
  return [...stores];
};


export const getInventory = async () => {
  await delay(100);
  return [...inventory];
};


export const getProducts = async (query = '', location = null) => {
  await delay(150); // Reduced delay for faster results

  
  // Track search for analytics
  if (query) {
    searchHistory.push({ query, timestamp: new Date().toISOString() });
  }

  // Start with all products
  let filteredProducts = [...products];

  // Search by name or category or brand
  if (query) {
    const q = query.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  }

  // Combine with inventory and store data
  let result = filteredProducts.map(product => {
    // Find all inventory records for this product
    const productInv = inventory.filter(i => i.productId === product.id && i.stock > 0);
    
    // If no stock anywhere, track lost demand
    if (productInv.length === 0) {
      if (query) {
        analytics.lostDemand.push({ productId: product.id, timestamp: new Date().toISOString() });
      }
      return { ...product, stock: 0, storeName: 'Out of Stock', distance: null };
    }

    // Map to stores and calculate distance if location is provided
    let storeOptions = productInv.map(inv => {
      const store = stores.find(s => s.id === inv.storeId);
      let dist = null;
      if (location && location.lat && location.lng) {
        dist = calculateDistance(location.lat, location.lng, store.lat, store.lng);
      }
      return { ...store, stock: inv.stock, distance: dist ? parseFloat(dist) : null };
    });


    // Sort stores by distance if available, otherwise by stock
    storeOptions.sort((a, b) => {
      if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
      return b.stock - a.stock;
    });

    // Pick the best store (closest or most stock)
    const bestStore = storeOptions[0];

    return {
      ...product,
      stock: bestStore.stock,
      storeName: bestStore.name,
      distance: bestStore.distance,
      storeId: bestStore.id,
      lat: bestStore.lat,
      lng: bestStore.lng
    };
  });

  return result;
};

export const createReservation = async (data) => {
  await delay(150); // Faster processing


  const { productId, storeId } = data;
  
  // Find the inventory record
  const invIndex = inventory.findIndex(i => i.productId === productId && (!storeId || i.storeId === storeId));
  
  if (invIndex === -1 || inventory[invIndex].stock <= 0) {
    throw new Error('Product is out of stock.');
  }

  // Reduce stock
  inventory[invIndex].stock -= 1;

  // Add reservation
  const expiryTime = new Date(Date.now() + 10 * 60000); // 10 minutes from now
  const newReservation = {
    id: `RES-${Math.floor(Math.random() * 10000)}`,
    productId,
    storeId: inventory[invIndex].storeId,
    status: 'active',
    expiryTime: expiryTime.toISOString(),
    createdAt: new Date().toISOString()
  };

  reservations.push(newReservation);
  analytics.reservationStats.active += 1;

  // Simulate real-time event
  emitEvent('reservation:created', newReservation);
  emitEvent('stock:update', { productId, storeId: inventory[invIndex].storeId, newStock: inventory[invIndex].stock });

  // Auto-expire logic (simulated)
  setTimeout(() => {
    expireReservation(newReservation.id);
  }, 10 * 60000);

  return newReservation;
};

const expireReservation = (resId) => {
  const resIndex = reservations.findIndex(r => r.id === resId && r.status === 'active');
  if (resIndex !== -1) {
    const res = reservations[resIndex];
    res.status = 'expired';
    
    // Restore stock
    const invIndex = inventory.findIndex(i => i.productId === res.productId && i.storeId === res.storeId);
    if (invIndex !== -1) {
      inventory[invIndex].stock += 1;
      emitEvent('stock:update', { productId: res.productId, storeId: res.storeId, newStock: inventory[invIndex].stock });
    }

    analytics.reservationStats.active -= 1;
    analytics.reservationStats.expired += 1;
    emitEvent('reservation:expired', res);
  }
};

export const getReservations = async () => {
  await delay(100);
  return [...reservations];
};


export const getAnalytics = async () => {
  await delay(200); // Faster dashboard loading

  
  // Calculate popular products based on reservations
  const resCount = {};
  reservations.forEach(r => {
    resCount[r.productId] = (resCount[r.productId] || 0) + 1;
  });

  const popular = Object.entries(resCount)
    .map(([pid, count]) => {
      const product = products.find(p => p.id === parseInt(pid));
      if (!product) return null;
      return {
        ...product,
        reservationCount: count
      };
    })
    .filter(p => p !== null)
    .sort((a, b) => b.reservationCount - a.reservationCount)
    .slice(0, 8);

  // ── Category-level demand analysis ──────────────────────────────────
  const categories = ['Electronics', 'Home Appliances', 'Clothing', 'Sports', 'Gaming'];

  const categoryDemand = categories.map(cat => {
    const catProducts = products.filter(p => p.category === cat);
    const catInventory = inventory.filter(i => catProducts.some(p => p.id === i.productId));
    const totalStock = catInventory.reduce((sum, i) => sum + i.stock, 0);
    const outOfStockCount = catInventory.filter(i => i.stock === 0).length;
    const lowStockCount = catInventory.filter(i => i.stock > 0 && i.stock < 5).length;
    const lostDemandCount = analytics.lostDemand.filter(d =>
      catProducts.some(p => p.id === d.productId)
    ).length;
    const reservationCount = reservations.filter(r =>
      catProducts.some(p => p.id === r.productId)
    ).length;

    return {
      category: cat,
      totalProducts: catProducts.length,
      totalStock,
      outOfStockCount,
      lowStockCount,
      lostDemandCount,
      reservationCount,
      // Demand score: higher = more demand relative to stock
      demandScore: totalStock > 0 ? Math.min(100, Math.round((reservationCount / (totalStock / 10)) * 100)) : 100,
    };
  });

  // ── Simulated weekly reservation trend (last 7 days) ──────────────
  const weeklyTrend = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
    day,
    reservations: Math.floor(Math.random() * 30) + 5 + (i === 4 ? 20 : 0), // spike on Friday
    fulfilled: Math.floor(Math.random() * 25) + 3,
  }));

  // ── Top 10 products by demand (with stock alert flag) ─────────────
  const allProductDemand = products.slice(0, 20).map(p => {
    const totalStock = inventory.filter(i => i.productId === p.id).reduce((s, i) => s + i.stock, 0);
    const demandHits = analytics.lostDemand.filter(d => d.productId === p.id).length;
    return {
      ...p,
      totalStock,
      demandHits,
      reservationCount: resCount[p.id] || 0,
      needsRestock: totalStock < 10 || demandHits > 0,
    };
  }).sort((a, b) => (b.reservationCount + b.demandHits * 2) - (a.reservationCount + a.demandHits * 2));

  return {
    ...analytics,
    popularProducts: popular,
    totalProducts: products.length,
    totalStores: stores.length,
    activeReservations: reservations.filter(r => r.status === 'active').length,
    categoryDemand,
    weeklyTrend,
    allProductDemand: allProductDemand.slice(0, 10),
  };
};

export const getProductStores = async (productId, location = null) => {
  await delay(150);

  
  const productInv = inventory.filter(i => i.productId === parseInt(productId));
  
  let storeOptions = productInv.map(inv => {
    const store = stores.find(s => s.id === inv.storeId);
    let dist = null;
    if (location && location.lat && location.lng) {
      dist = calculateDistance(location.lat, location.lng, store.lat, store.lng);
    }
    return { ...store, stock: inv.stock, distance: dist ? parseFloat(dist) : null };
  });


  storeOptions.sort((a, b) => {
    if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
    return b.stock - a.stock;
  });

  return storeOptions;
};

export const updateStock = async (productId, storeId, newStock) => {
  await delay(100);

  const invIndex = inventory.findIndex(i => i.productId === productId && i.storeId === storeId);
  if (invIndex !== -1) {
    inventory[invIndex].stock = newStock;
    emitEvent('stock:update', { productId, storeId, newStock });
    return true;
  }
  return false;
};
