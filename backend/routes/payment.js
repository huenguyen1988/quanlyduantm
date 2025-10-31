const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

// View payments: require login; allowed for all authenticated roles
router.get('/', auth(), paymentController.getPayments);
router.get('/total', auth(), paymentController.getTotalByProject);
router.get('/:id', auth(), paymentController.getPaymentById);

// Modify payments: only admin or kế toán
router.post('/', auth(['admin', 'ketoan']), paymentController.createPayment);
router.put('/:id', auth(['admin', 'ketoan']), paymentController.updatePayment);
router.delete('/:id', auth(['admin', 'ketoan']), paymentController.deletePayment);

module.exports = router; 