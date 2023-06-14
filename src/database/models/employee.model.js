const { DataTypes } = require('sequelize');
const sequelize = require('@/config/instance');
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

Employee.beforeCreate(async (employee) => {
  const foundEmployee = await Employee.findByPk(employee.employeeNumber);
  if (foundEmployee) {
    throw new Error('Employee number must be unique');
  }
});
Employee.beforeUpdate(async (employee) => {
  const fieldsValidation = ['lastName', 'firstName', 'employeeNumber'];
  fieldsValidation.forEach((fieldName) => {
    if (employee.changed(fieldName) && employee.previous(fieldName)) {
      throw new Error(`${fieldName} field cannot be updated.`);
    }
  });
});

module.exports = Employee;
