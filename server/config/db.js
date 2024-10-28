const { Sequelize } = require('sequelize');

const fs = require('fs');
const path = require('path');
const caCertPath = path.join(__dirname, 'ca.pem');
const caCert = fs.readFileSync(caCertPath, 'utf8');

// Connect to MySQL Database
const sequelize = new Sequelize('profit_loss_tracker', process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      ca: caCert // Include the CA certificate for SSL connection
    }
  },
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
