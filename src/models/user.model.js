const sequelize = require('../config/instance');
const { DataTypes } = require('sequelize');
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
    unique: {
      msg: 'This account user has already created',
    },
  },
});
User.beforeCreate(async (user) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  } catch (err) {
    console.log(err);
  }
});

module.exports = User;
