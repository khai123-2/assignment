const Joi = require("joi");

const customerSchema = Joi.object({
  customerNumber: Joi.number().integer().positive(),
  customerName: Joi.string().min(5).max(50).required(),
  contactLastName: Joi.string().min(3).max(50).required(),
  contactFirstName: Joi.string().min(3).max(50).required(),
  phone: Joi.string().min(8).max(20).required(),
  addressLine1: Joi.string().min(10).max(50).required(),
  addressLine2: Joi.string().min(10).max(50).allow(null),
  city: Joi.string().min(2).max(50).required(),
  state: Joi.string().min(2).max(50).allow(null),
  postalCode: Joi.string().min(5).max(15).allow(null),
  country: Joi.string().min(2).max(50).required(),
  salesRepEmployeeNumber: Joi.number().integer().positive().allow(null),
  creditLimit: Joi.number().precision(2).allow(null),
});

module.exports = customerSchema;
