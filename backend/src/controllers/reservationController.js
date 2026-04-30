const db = require('../config/db');
const Reservation = require('../models/Reservation');
const socketService = require('../services/socketService');

exports.createReservation = (req, res) => {
  const { productId, storeId, userId } = req.body;
  const item = db.inventory.find(i => i.productId === parseInt(productId) && i.storeId === parseInt(storeId));
  
  if (!item || item.stock <= 0) {
    return res.status(400).json({ message: 'Product out of stock at this location' });
  }

  item.stock -= 1;
  const reservation = Reservation.create(productId, storeId, userId);
  
  db.reservations.push(reservation);
  socketService.emitStockUpdate(item.productId, item.storeId, item.stock);
  
  res.json(reservation);
};

exports.getReservations = (req, res) => {
  res.json(db.reservations);
};

exports.confirmReservation = (req, res) => {
  const { id } = req.params;
  const reservation = db.reservations.find(r => r.id === parseInt(id));
  if (reservation) {
    reservation.status = 'confirmed';
    socketService.emitNotification(reservation.userId, 'Your reservation has been confirmed by the store!', 'success');
    res.json(reservation);
  } else {
    res.status(404).json({ message: 'Reservation not found' });
  }
};
