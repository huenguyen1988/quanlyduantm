const Project = require('../models/project');
const Stage = require('../models/stage');
const Task = require('../models/task');
const Log = require('../models/log');

// Tạo mới Project
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    // audit log
    if (req.user) {
      await Log.create({
        action: 'create',
        module: 'project',
        actorId: req.user.userId,
        actorName: req.user.name || '',
        targetId: project._id,
        targetName: project.name,
        details: { customer: project.customer }
      });
    }
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy danh sách Project
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy Project theo ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });

    // Lấy danh sách stages liên quan đến project này
    const stages = await Stage.find({ projectId: project._id });
    // Lấy tasks cho từng stage
    const stagesWithTasks = await Promise.all(
      stages.map(async (stage) => {
        const tasks = await Task.find({ stageId: stage._id });
        return { ...stage.toObject(), tasks };
      })
    );
    res.json({ ...project.toObject(), stages: stagesWithTasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật Project
exports.updateProject = async (req, res) => {
  try {
    const before = await Project.findById(req.params.id);
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Not found' });
    if (req.user) {
      await Log.create({
        action: 'update',
        module: 'project',
        actorId: req.user.userId,
        actorName: req.user.name || '',
        targetId: project._id,
        targetName: project.name,
        details: {
          nameChanged: before?.name !== project.name,
          datesChanged: String(before?.startDate||'') !== String(project.startDate||'') || String(before?.endDate||'') !== String(project.endDate||''),
          valueChanged: before?.contractValue !== project.contractValue
        }
      });
    }
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    if (req.user) {
      await Log.create({
        action: 'delete',
        module: 'project',
        actorId: req.user.userId,
        actorName: req.user.name || '',
        targetId: project._id,
        targetName: project.name
      });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 