const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

// Allow public register, but if authenticated, middleware attaches req.user so we can log the actor
router.post('/register', (req, res, next) => next(), userController.register);
router.post('/login', userController.login);
router.get('/', auth(), userController.getUsers);
router.post('/change-password', auth(), userController.changePassword);
router.put('/:id', auth(['admin']), userController.updateUser);
router.delete('/:id', auth(['admin']), userController.deleteUser);

module.exports = router; 