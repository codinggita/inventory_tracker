const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.getProducts);
router.get('/stores', productController.getStores);
router.get('/inventory', productController.getInventory);
router.post('/admin/inventory/update', productController.updateStock);

module.exports = router;
