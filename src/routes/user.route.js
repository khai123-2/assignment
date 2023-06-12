const express = require('express');
const userController = require('@/controller/user.controller');
const router = express.Router();
const validate = require('@/middleware/validate');
const userSchema = require('@/database/schemas/user.schema');

router.get('/', userController.getAllUsers);
router.post('/register', validate(userSchema), userController.registerUser);
router.post('/login', userController.login);

module.exports = router;
