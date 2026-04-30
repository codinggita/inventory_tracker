const db = require('../config/db');

exports.getAnalytics = (req, res) => {
  const resCount = {};
  db.reservations.forEach(r => {
    resCount[r.productId] = (resCount[r.productId] || 0) + 1;
  });

  const popular = Object.entries(resCount)
    .map(([pid, count]) => {
      const product = db.products.find(p => p.id === parseInt(pid));
      return product ? { ...product, reservationCount: count } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.reservationCount - a.reservationCount)
    .slice(0, 8);

  const categoryStats = ['Electronics', 'Home Appliances', 'Clothing', 'Sports', 'Gaming'].map(cat => {
    const catProducts = db.products.filter(p => p.category === cat);
    const catInventory = db.inventory.filter(i => catProducts.some(p => p.id === i.productId));
    const totalStock = catInventory.reduce((sum, i) => sum + i.stock, 0);
    const reservationsForCat = db.reservations.filter(r => catProducts.some(p => p.id === r.productId)).length;
    return {
      category: cat,
      totalStock,
      reservationCount: reservationsForCat,
      demandScore: totalStock > 0 ? Math.min(100, Math.round((reservationsForCat / (totalStock / 10 + 1)) * 100)) : 100
    };
  });

  res.json({
    totalProducts: db.products.length,
    totalStores: db.stores.length,
    activeReservations: db.reservations.filter(r => r.status === 'active').length,
    popularProducts: popular,
    categoryDemand: categoryStats,
    lostDemand: db.lostDemand.length
  });
};
