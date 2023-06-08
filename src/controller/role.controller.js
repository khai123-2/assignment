const Role = require('../models/role.model');
const roleSchema = require('../schemas/role.schema');
const getAllRoles = async (_req, res) => {
  try {
    const roles = await Role.findAll();
    return res.status(201).send({ data: roles });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const createRole = async (req, res) => {
  try {
    const { error, value } = roleSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const role = await Role.create(value);
    return res.status(201).send({ message: 'Role was created ', data: role });
  } catch (err) {
    if (err.name) {
      const error = err.errors[0].message;
      return res.status(500).send({ error });
    } else {
      return res.status(500).send({ error: err.message });
    }
  }
};

module.exports = {
  getAllRoles,
  createRole,
};
