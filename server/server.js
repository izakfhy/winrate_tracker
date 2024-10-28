const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const tradeRoutes = require('./routes/tradeRoutes');

const app = express();
app.use(bodyParser.json());

// Test database connection and sync models
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.log('Error syncing database: ' + err));

// Set up routes
app.use('/api', tradeRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
