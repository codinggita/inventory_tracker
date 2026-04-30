const db = require('../config/db');
const { calculateDistance } = require('../services/distanceService');
const socketService = require('../services/socketService');

exports.getProducts = (req, res) => {
  const { q, lat, lng } = req.query;
  let filtered = [...db.products];

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query)
    );
    db.searchHistory.push({ query: q, timestamp: new Date().toISOString() });
  }

  const results = filtered.map(product => {
    const productInv = db.inventory.filter(i => i.productId === product.id && i.stock > 0);
    
    if (productInv.length === 0) {
      if (q) db.lostDemand.push({ productId: product.id, timestamp: new Date().toISOString() });
      return { ...product, stock: 0, storeName: 'Out of Stock', distance: null };
    }

    let storeOptions = productInv.map(inv => {
      const store = db.stores.find(s => s.id === inv.storeId);
      let dist = (lat && lng) ? calculateDistance(parseFloat(lat), parseFloat(lng), store.lat, store.lng) : null;
      return { ...store, stock: inv.stock, distance: dist };
    });

    storeOptions.sort((a, b) => {
      if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
      return b.stock - a.stock;
    });

    const best = storeOptions[0];
    return {
      ...product,
      stock: best.stock,
      storeName: best.name,
      distance: best.distance,
      storeId: best.id,
      lat: best.lat,
      lng: best.lng
    };
  });

  res.json(results);
};

exports.getStores = (req, res) => {
  res.json(db.stores);
};

exports.getInventory = (req, res) => {
  const { productId, lat, lng } = req.query;
  let results = db.inventory;
  if (productId) {
    results = db.inventory.filter(i => i.productId === parseInt(productId));
  }
  
  const mapped = results.map(inv => {
    const store = db.stores.find(s => s.id === inv.storeId);
    let dist = (lat && lng) ? calculateDistance(parseFloat(lat), parseFloat(lng), store.lat, store.lng) : null;
    return { ...inv, storeName: store.name, distance: dist };
  });

  mapped.sort((a, b) => {
    if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
    return b.stock - a.stock;
  });

  res.json(mapped);
};

exports.updateStock = (req, res) => {
  const { productId, storeId, stock } = req.body;
  const item = db.inventory.find(i => i.productId === parseInt(productId) && i.storeId === parseInt(storeId));
  const newStock = parseInt(stock);

  if (item) {
    item.stock = newStock;
    socketService.emitStockUpdate(item.productId, item.storeId, item.stock);
    res.json({ success: true, newStock: item.stock });
  } else {
    const newItem = { productId: parseInt(productId), storeId: parseInt(storeId), stock: newStock };
    db.inventory.push(newItem);
    socketService.emitStockUpdate(newItem.productId, newItem.storeId, newItem.stock);
    res.json({ success: true, newStock: newItem.stock });
  }
};
