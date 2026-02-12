const express = require('express');
const router = express.Router();
const axios = require('axios');
const { sequelize, Wallet, Order, Ledger } = require('../models');

// Create Order
router.post('/orders', async (req, res) => {
    const client_id = req.headers['client-id'];
    const { amount } = req.body;

    if (!client_id) return res.status(400).json({ error: 'Missing client-id header' });

    const t = await sequelize.transaction();

    try {
        const wallet = await Wallet.findOne({ where: { client_id }, transaction: t, lock: true });
        
        if (!wallet || parseFloat(wallet.balance) < parseFloat(amount)) {
            await t.rollback();
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        wallet.balance = parseFloat(wallet.balance) - parseFloat(amount);
        await wallet.save({ transaction: t });

        const order = await Order.create({ client_id, amount }, { transaction: t });
        await Ledger.create({ client_id, amount, type: 'ORDER', description: `Order ${order.id}` }, { transaction: t });

        await t.commit();

        try {
            const fulfillmentResponse = await axios.post('https://jsonplaceholder.typicode.com/posts', {
                userId: client_id,
                title: order.id.toString()
            });
            order.fulfillment_id = fulfillmentResponse.data.id;
            order.status = 'FULFILLED';
            await order.save();
            res.json({ order_id: order.id, status: 'FULFILLED', fulfillment_id: order.fulfillment_id });
        } catch (apiError) {
            order.status = 'FAILED_FULFILLMENT';
            await order.save();
            res.status(502).json({ error: 'Order created but fulfillment failed', order_id: order.id });
        }
    } catch (error) {
        if (!t.finished) await t.rollback();
        res.status(500).json({ error: error.message });
    }
});

// Get Order
router.get('/orders/:order_id', async (req, res) => {
    const client_id = req.headers['client-id'];
    const { order_id } = req.params;
    const order = await Order.findOne({ where: { id: order_id, client_id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
});

// Get Balance
router.get('/wallet/balance', async (req, res) => {
    const client_id = req.headers['client-id'];
    const wallet = await Wallet.findOne({ where: { client_id } });
    res.json({ client_id, balance: wallet ? wallet.balance : 0.00 });
});

module.exports = router;