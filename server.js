const express = require('express');
const bodyParser = require('body-parser');
const { initDB } = require('./models');
const adminRoutes = require('./routes/admin');
const clientRoutes = require('./routes/client');

const app = express();
app.use(bodyParser.json());

// Initialize Database
initDB();

// Routes
app.use('/admin/wallet', adminRoutes);
app.use('/', clientRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});