const express = require('express');
const router = express.Router();
const customerController = require('../controller/customer.controller');
const isAuth = require('../middleware/isAuth');
const checkPermissions = require('../middleware/checkPermission');
const validate = require('../middleware/validate');
const CustomerSchema = require('../schemas/customer.schema');
router.get(
  '/',
  isAuth,
  checkPermissions(['President', 'Manager', 'Leader', 'Staff']),
  customerController.getAllCustomers,
);
router.get('/:id', isAuth, customerController.getCustomerById);
router.post(
  '/',
  isAuth,
  checkPermissions(['President', 'Manager', 'Leader', 'Staff']),
  validate(CustomerSchema),
  customerController.createCustomer,
);
router.delete('/:id', isAuth, checkPermissions(['President', 'Manager', 'Leader']), customerController.deleteCustomer);
router.put(
  '/:id',
  isAuth,
  checkPermissions(['President', 'Manager', 'Leader']),
  validate(CustomerSchema),
  customerController.updateCustomer,
);

module.exports = router;
