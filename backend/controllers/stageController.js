const Stage = require('../models/stage');

exports.createStage = async (req, res) => {
  try {
    const stage = new Stage(req.body);
    await stage.save();
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
    const stage = await Stage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stage) return res.status(404).json({ error: 'Not found' });
    res.json(stage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteStage = async (req, res) => {
  try {
    const stage = await Stage.findByIdAndDelete(req.params.id);
    if (!stage) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 