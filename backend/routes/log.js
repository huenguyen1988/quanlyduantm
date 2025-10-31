const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const auth = require('../middlewares/auth');

// Admin only
router.get('/', auth(['admin']), logController.getLogs);
router.get('/export', auth(['admin']), logController.exportCsv);
router.delete('/', auth(['admin']), logController.clearAll);

module.exports = router;


