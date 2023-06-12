const { DataTypes } = require('sequelize');
const sequelize = require('@/config/instance');
const Customer = sequelize.define('Customer', {
  customerNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  contactLastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  contactFirstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  addressLine1: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  addressLine2: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  postalCode: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  salesRepEmployeeNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  creditLimit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
});

Customer.beforeValidate(async (customer) => {
  const fieldsValidation = ['customerNumber'];
  fieldsValidation.forEach((fieldName) => {
    if (customer.changed(fieldName) && customer.previous(fieldName)) {
      throw new Error(`${fieldName} field cannot be updated.`);
    }
  });
  //Check customerNumber has not yet existed
  const foundCustomer = await Customer.findByPk(customer.customerNumber);
  if (foundCustomer) {
    throw new Error('Customer number must be unique');
  }
});
module.exports = Customer;
