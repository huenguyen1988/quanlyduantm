const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  filePath: String,
  fileType: String,
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', FileSchema); 