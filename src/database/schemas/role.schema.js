const Joi = require('joi');

const roleSchema = Joi.object({
  id: Joi.number().integer().positive(),
  role: Joi.string().max(50).required(),
});

module.exports = roleSchema;
