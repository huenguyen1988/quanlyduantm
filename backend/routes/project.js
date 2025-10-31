const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middlewares/auth');

// Read operations: require login
router.get('/', auth(), projectController.getProjects);
router.get('/:id', auth(), projectController.getProjectById);

// Write operations: only admin or manager (quanly)
router.post('/', auth(['admin', 'quanly']), projectController.createProject);
router.put('/:id', auth(['admin', 'quanly']), projectController.updateProject);
router.delete('/:id', auth(['admin', 'quanly']), projectController.deleteProject);

module.exports = router; 