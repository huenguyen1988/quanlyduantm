const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  action: { type: String, enum: ['create', 'update', 'delete'], required: true },
  module: { type: String, default: 'user' },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorName: String,
  targetId: { type: mongoose.Schema.Types.ObjectId },
  targetName: String,
  targetEmail: String,
  details: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);


