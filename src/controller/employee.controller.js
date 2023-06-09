const Employee = require('../database/models/employee.model');
const { NotFoundError } = require('../error/errorsException');
const getAllEmployees = async (_req, res, next) => {
  try {
    const employees = await Employee.findAll();
    return res.status(200).send({ data: employees });
  } catch (err) {
    next(err);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }
    return res.status(200).send({ data: employee });
  } catch (err) {
    next(err);
  }
};
const createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);
    return res.status(201).send({ message: 'Employee was created ', data: employee });
  } catch (err) {
    next(err);
  }
};

const DeleteEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const employeeFinder = await Employee.findByPk(employeeId);
    if (!employeeFinder) {
      throw new NotFoundError('Employee not found');
    }
    await employeeFinder.destroy();
    return res.status(200).send({ message: 'Employee was deleted' });
  } catch (err) {
    next(err);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.id;
    const employeeFinder = await Employee.findByPk(employeeId);
    if (employeeFinder) {
      const data = req.body;
      employeeFinder.set(data);
      await employeeFinder.save();
      return res.status(200).send({ message: 'Employee was updated', data: employeeFinder });
    }

    throw new NotFoundError('Employee not found');
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  DeleteEmployee,
  updateEmployee,
};
