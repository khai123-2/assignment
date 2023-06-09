const Customer = require('@/database/models/customer.model');
const Employee = require('@/database/models/employee.model');
const { NotFoundError } = require('@/error/errorsException');
const getAllCustomers = async (req, res, next) => {
  try {
    const userRole = req.user.Role.role;
    let customers;
    if (userRole == 'Staff') {
      const employeeNumber = req.user.employeeNumber;
      customers = await Customer.findAll({
        where: {
          salesRepEmployeeNumber: employeeNumber,
        },
      });
      return res.status(200).send({ data: customers });
    } else if (userRole == 'Leader') {
      const officeCodeUser = req.user.officeCode;
      customers = await Customer.findAll({
        include: {
          model: Employee,
          where: {
            officeCode: officeCodeUser,
          },
          attributes: [],
        },
      });
      return res.status(200).send({ data: customers });
    } else {
      customers = await Customer.findAll();
    }
    return res.status(200).send({ data: customers });
  } catch (err) {
    next(err);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const userRole = req.user.Role.role;
    let customer = await Customer.findByPk(customerId);
    if (userRole == 'Staff') {
      const employeeNumber = req.user.employeeNumber;
      customer = await Customer.findOne({
        where: {
          customerNumber: customerId,
          salesRepEmployeeNumber: employeeNumber,
        },
      });
    }
    if (userRole == 'Leader') {
      const officeCodeUser = req.user.officeCode;
      customer = await Customer.findByPk(customerId, {
        include: {
          model: Employee,
          where: {
            officeCode: officeCodeUser,
          },
        },
      });
    }

    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    return res.status(200).send({ data: customer });
  } catch (err) {
    next(err);
  }
};
const createCustomer = async (req, res, next) => {
  try {
    const userRole = req.user.Role.role;
    const { salesRepEmployeeNumber } = req.body;
    if (userRole == 'Leader') {
      const employee = await Employee.findByPk(salesRepEmployeeNumber);
      if (!employee) {
        throw new NotFoundError('Employee not found');
      }
      if (employee.officeCode !== req.user.officeCode) {
        throw new Error('Employee is not from the same office');
      }
    }
    if (userRole === 'Staff' && salesRepEmployeeNumber !== req.user.employeeNumber) {
      throw new Error('Customer does not belong to the employee');
    }
    const customer = await Customer.create(req.body);
    return res.status(201).send({ message: 'Customer was created ', data: customer });
  } catch (err) {
    next(err);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const userRole = req.user.Role.role;
    const customerFinder = await Customer.findByPk(customerId);
    if (!customerFinder) {
      throw new NotFoundError('Customer not found');
    }
    if (userRole == 'Leader') {
      const officeCodeUser = req.user.officeCode;
      const employee = await Employee.findByPk(customerFinder.salesRepEmployeeNumber);

      if (employee.officeCode !== officeCodeUser) {
        throw new Error("is not from the same office's employee");
      }
    }
    await customerFinder.destroy();
    return res.status(200).send({ message: 'Customer was deleted' });
  } catch (err) {
    next(err);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const userRole = req.user.Role.role;
    const customerFinder = await Customer.findByPk(customerId);
    if (!customerFinder) {
      throw new NotFoundError('Customer not found');
    }
    if (userRole === 'Leader') {
      const officeCodeUser = req.user.officeCode;
      const employee = await Employee.findByPk(customerFinder.salesRepEmployeeNumber);

      if (employee.officeCode !== officeCodeUser) {
        throw new Error("Customer is not from the same office's employee");
      }
    }
    const data = req.body;
    customerFinder.set(data);
    await customerFinder.save();
    return res.status(200).send({ message: 'Customer was updated', data: customerFinder });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  deleteCustomer,
  updateCustomer,
};
