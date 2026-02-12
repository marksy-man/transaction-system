const express = require('express');
const router = express.Router();
const { sequelize, Wallet, Ledger } = require('../models');

// Credit Wallet
router.post('/credit', async (req, res) => {
    const { client_id, amount } = req.body;
    const t = await sequelize.transaction();

    try {
        let wallet = await Wallet.findOne({ where: { client_id }, transaction: t });
        if (!wallet) {
            wallet = await Wallet.create({ client_id, balance: 0 }, { transaction: t });
        }

        wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);
        await wallet.save({ transaction: t });
        await Ledger.create({ client_id, amount, type: 'CREDIT', description: 'Admin credit' }, { transaction: t });

        await t.commit();
        res.json({ message: 'Wallet credited', balance: wallet.balance });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
});

// Debit Wallet
router.post('/debit', async (req, res) => {
    const { client_id, amount } = req.body;
    const t = await sequelize.transaction();

    try {
        const wallet = await Wallet.findOne({ where: { client_id }, transaction: t });

        if (!wallet || parseFloat(wallet.balance) < parseFloat(amount)) {
            await t.rollback();
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        wallet.balance = parseFloat(wallet.balance) - parseFloat(amount);
        await wallet.save({ transaction: t });
        await Ledger.create({ client_id, amount, type: 'DEBIT', description: 'Admin debit' }, { transaction: t });

        await t.commit();
        res.json({ message: 'Wallet debited', balance: wallet.balance });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;