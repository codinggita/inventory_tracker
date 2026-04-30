const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.get('/reservations', reservationController.getReservations);
router.post('/reserve', reservationController.createReservation);
router.post('/reservations/:id/confirm', reservationController.confirmReservation);

module.exports = router;
