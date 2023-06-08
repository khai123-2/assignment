const express = require("express");
const employeeController = require("../controller/employee.controller");
const isAuth = require("../middleware/isAuth");
const checkPermissions = require("../middleware/checkPermission");
const employeeSchema = require("../schemas/employee.schema");
const validate = require("../middleware/validate");
const router = express.Router();

router.get(
  "/",
  isAuth,
  checkPermissions(["President", "Manager", "Leader"]),
  employeeController.getAllEmployees
);
router.get(
  "/:id",
  isAuth,
  checkPermissions(["President", "Manager", "Leader"]),
  employeeController.getEmployeeById
);
router.post(
  "/",
  isAuth,
  checkPermissions(["President", "Manager"]),
  validate(employeeSchema),
  employeeController.createEmployee
);
router.put(
  "/:id",
  isAuth,
  validate(employeeSchema),
  checkPermissions(["President", "Manager"]),
  employeeController.updateEmployee
);
router.delete(
  "/:id",
  isAuth,
  checkPermissions(["President"]),
  employeeController.DeleteEmployee
);

module.exports = router;
