const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('transaction_db', 'root', 'aryan1404@', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = sequelize;