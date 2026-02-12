const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('transaction_db', 'root', 'YOUR_DATABASE_PASSWORD', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = sequelize;