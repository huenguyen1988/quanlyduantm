const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  manager: { type: String },
  stageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stage', required: true },
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ['chua bat dau', 'dang thuc hien', 'hoan thanh'], default: 'chua bat dau' },
  progress: { type: Number, default: 0 },
  files: [{ type: String }],
});

module.exports = mongoose.model('Task', TaskSchema); 