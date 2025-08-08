const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  type: { type: String, enum: ['tam ung', 'thanh toan', 'quyet toan'], required: true },
  amount: Number,
  paymentDate: Date,
  note: String,
});

module.exports = mongoose.model('Payment', PaymentSchema); 