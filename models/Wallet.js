const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Wallet = sequelize.define('Wallet', {
    client_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    balance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 }
});

module.exports = Wallet;