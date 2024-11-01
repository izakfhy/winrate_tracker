const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const tradeRoutes = require('./routes/tradeRoutes');
const cors = require('cors');
const path = require("path")

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../build')));
// Test database connection and sync models
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.log('Error syncing database: ' + err));

// Set up routes
app.use('/api', tradeRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
