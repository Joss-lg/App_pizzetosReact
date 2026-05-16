const express = require('express');

const { createOrder, getOrders } = require('../controllers/orderController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, getOrders);
router.post('/', requireAuth, createOrder);

module.exports = router;
