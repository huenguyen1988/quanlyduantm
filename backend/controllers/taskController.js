const Task = require('../models/task');
const Log = require('../models/log');

exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    if (req.user) {
      await Log.create({
        action: 'create',
        module: 'task',
        actorId: req.user.userId,
        actorName: req.user.name || '',
        targetId: task._id,
        targetName: task.name,
        details: { stageId: task.stageId, status: task.status, progress: task.progress }
      });
    }
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const before = await Task.findById(req.params.id);
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Not found' });
    if (req.user) {
      await Log.create({
        action: 'update',
        module: 'task',
        actorId: req.user.userId,
        actorName: req.user.name || '',
        targetId: task._id,
        targetName: task.name,
        details: {
          nameChanged: before?.name !== task.name,
          statusChanged: before?.status !== task.status,
          progressChanged: String(before?.progress) !== String(task.progress),
          datesChanged: String(before?.startDate||'') !== String(task.startDate||'') || String(before?.endDate||'') !== String(task.endDate||''),
          managerChanged: before?.manager !== task.manager
        }
      });
    }
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    if (req.user) {
      await Log.create({
        action: 'delete',
        module: 'task',
        actorId: req.user.userId,
        actorName: req.user.name || '',
        targetId: task._id,
        targetName: task.name,
      });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 