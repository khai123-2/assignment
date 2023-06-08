const express = require("express");
const roleController = require("../controller/role.controller");
const router = express.Router();

router.get("/", roleController.getAllRoles);
router.post("/", roleController.createRole);

module.exports = router;
