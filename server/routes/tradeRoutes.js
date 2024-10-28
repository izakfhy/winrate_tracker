const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');

router.get('/stats', tradeController.getStats);  // Get statistics
router.get('/trades', tradeController.getTrades); // Get all trades
router.post('/trades', tradeController.addTrade); // Add a new trade

module.exports = router;
