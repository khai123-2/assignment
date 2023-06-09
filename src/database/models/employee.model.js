const { DataTypes } = require('sequelize');
const sequelize = require('../../config/instance');
const { ValidationError } = require('../../error/errorsException');
const Employee = sequelize.define('Employee', {
  employeeNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  extension: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  officeCode: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  reportsTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Employee.beforeSave((employee) => {
  const fieldsValidation = ['lastName', 'firstName'];
  fieldsValidation.forEach((fieldName) => {
    if (employee.changed(fieldName)) {
      throw new ValidationError(`${fieldName} field cannot be updated.`);
    }
  });
});

module.exports = Employee;
