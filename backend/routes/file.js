const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/fileController');
const auth = require('../middlewares/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', auth(), upload.single('file'), fileController.uploadFileToS3);

module.exports = router; 