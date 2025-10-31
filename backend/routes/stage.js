const express = require('express');
const router = express.Router();
const stageController = require('../controllers/stageController');
const auth = require('../middlewares/auth');

router.post('/', auth(), stageController.createStage);
router.get('/', auth(), stageController.getStages);
router.get('/:id', auth(), stageController.getStageById);
router.put('/:id', auth(), stageController.updateStage);
router.delete('/:id', auth(), stageController.deleteStage);

module.exports = router; 