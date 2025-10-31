const Log = require('../models/log');

exports.getLogs = async (req, res) => {
  try {
    const { limit = 200, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Log.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Log.countDocuments()
    ]);
    res.json({ items, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.exportCsv = async (_req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }).limit(5000);
    const header = 'time,action,module,actorName,targetName,targetEmail\n';
    const rows = logs.map(l => [
      new Date(l.createdAt).toISOString(),
      l.action,
      l.module,
      (l.actorName || ''),
      (l.targetName || ''),
      (l.targetEmail || '')
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const csv = header + rows;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="logs.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.clearAll = async (_req, res) => {
  try {
    await Log.deleteMany({});
    res.json({ message: 'Cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


