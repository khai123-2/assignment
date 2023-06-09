const { DataTypes } = require('sequelize');
const sequelize = require('@/config/instance');
const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      msg: 'Role name must be unique',
    },
  },
});
module.exports = Role;
