const Joi = require('joi');

const employeeSchema = Joi.object({
  employeeNumber: Joi.number().integer().positive(),
  lastName: Joi.string().min(3).max(50).required(),
  firstName: Joi.string().min(3).max(50).required(),
  extension: Joi.string().max(50).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'vn'] } })
    .min(10)
    .max(100)
    .required(),
  officeCode: Joi.string().alphanum().max(10).required(),
  reportsTo: Joi.number().integer().min(1).allow(null),
  jobTitle: Joi.string().required(),
  roleId: Joi.number().integer().positive(),
});

module.exports = employeeSchema;
