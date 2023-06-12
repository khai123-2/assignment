const sequelize = require('@/config/instance');
const { DataTypes } = require('sequelize');
const { ValidationError } = require('@/error/errorsException');
const bcrypt = require('bcrypt');
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  employeeNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
User.beforeCreate(async (user) => {
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,100}$/;
  if (!passwordRegex.test(user.password)) {
    throw new ValidationError('Password must contain at least one number and one special character');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
});

module.exports = User;
