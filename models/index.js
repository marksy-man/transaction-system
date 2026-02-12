const sequelize = require('../config/database');
const Wallet = require('./Wallet');
const Order = require('./Order');
const Ledger = require('./Ledger');

const initDB = async () => {
    try {
        await sequelize.sync(); 
        console.log(' Database tables synced.');
    } catch (error) {
        console.error(' Database sync failed:', error);
    }
};

module.exports = { sequelize, Wallet, Order, Ledger, initDB };