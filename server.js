const express = require('express');
const app = express();
const db = require('./src/database/dbConnection');
const sequelize = require('./src/config/instance');
const route = require('./src/routes');
const Role = require('./src/database/models/role.model');
const Office = require('./src/database/models/office.model');
const Employee = require('./src/database/models/employee.model');
const Customer = require('./src/database/models/customer.model');
const User = require('./src/database/models/user.model');
const mongoDB = require('./src/config/db');
require('dotenv').config();
const port = process.env.PORT || 3000;
//Connect to database
db.dbConnection();
mongoDB.connect();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

Employee.hasMany(Customer, {
  foreignKey: 'salesRepEmployeeNumber',
});
Customer.belongsTo(Employee, {
  foreignKey: 'salesRepEmployeeNumber',
});

Employee.hasOne(User, {
  foreignKey: 'employeeNumber',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

User.belongsTo(Employee, {
  foreignKey: 'employeeNumber',
});
//
Employee.belongsTo(Role, {
  foreignKey: 'roleId',
});
Role.hasMany(Employee, {
  foreignKey: 'roleId',
});

Employee.belongsTo(Office, {
  foreignKey: 'officeCode',
});

Office.hasMany(Employee, {
  foreignKey: 'officeCode',
});
sequelize
  .sync()
  .then(() => {
    console.log('sync');
  })
  .catch((err) => {
    console.log(err);
  });

// Routes

route(app);
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

module.exports = app;
