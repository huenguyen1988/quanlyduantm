const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', auth(), userController.getUsers);
router.put('/:id', auth(['admin']), userController.updateUser);
router.delete('/:id', auth(['admin']), userController.deleteUser);

module.exports = router; 