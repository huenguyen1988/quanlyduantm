const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  status: String,
  customer: String,
  contractValue: Number,
});

module.exports = mongoose.model('Project', ProjectSchema); 