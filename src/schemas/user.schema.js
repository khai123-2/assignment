const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(6).max(100).required(),
  employeeNumber: Joi.number().positive().required(),
});

module.exports = userSchema;
