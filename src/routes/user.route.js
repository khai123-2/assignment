const express = require('express');
const userController = require('@/controller/user.controller');
const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.login);

module.exports = router;
