const { DataTypes } = require('sequelize');
const sequelize = require('@/config/instance');
const Office = sequelize.define('Office', {
  officeCode: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  city: {
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
  territory: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

module.exports = Office;
