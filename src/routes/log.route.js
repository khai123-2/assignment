const express = require('express');
const logController = require('@/controller/log.controller');
const router = express.Router();
const isAuth = require('@/middleware/isAuth');

router.get('/', isAuth, logController.getLogs);

module.exports = router;
