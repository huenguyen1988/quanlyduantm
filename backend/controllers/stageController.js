const Stage = require('../models/stage');
const Log = require('../models/log');

exports.createStage = async (req, res) => {
  try {
    const stage = new Stage(req.body);
    await stage.save();
    if (req.user) {
      await Log.create({
        action: 'create',
        module: 'stage',
        actorId: req.user.userId,
        actorName: req.user.name || '',
        targetId: stage._id,
        targetName: stage.name,
        details: { projectId: stage.projectId, manager: stage.manager }
      });
    }
    res.status(201).json(stage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getStages = async (req, res) => {
  try {
    const stages = await Stage.find();
    res.json(stages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStageById = async (req, res) => {
  try {
    const stage = await Stage.findById(req.params.id);
    if (!stage) return res.status(404).json({ error: 'Not found' });
    res.json(stage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStage = async (req, res) => {
  try {
    const before = await Stage.findById(req.params.id);
    const stage = await Stage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stage) return res.status(404).json({ error: 'Not found' });
    if (req.user) {
      await Log.create({
        action: 'update',
        module: 'stage',
        actorId: req.user.userId,
        actorName: req.user.name || '',
        targetId: stage._id,
        targetName: stage.name,
        details: {
          nameChanged: before?.name !== stage.name,
          managerChanged: before?.manager !== stage.manager,
          datesChanged: String(before?.startDate||'') !== String(stage.startDate||'') || String(before?.endDate||'') !== String(stage.endDate||'')
        }
      });
    }
    res.json(stage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteStage = async (req, res) => {
  try {
    const stage = await Stage.findByIdAndDelete(req.params.id);
    if (!stage) return res.status(404).json({ error: 'Not found' });
    if (req.user) {
      await Log.create({
        action: 'delete',
        module: 'stage',
        actorId: req.user.userId,
        actorName: req.user.name || '',
        targetId: stage._id,
        targetName: stage.name
      });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 