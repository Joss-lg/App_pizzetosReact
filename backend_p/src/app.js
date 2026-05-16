const express = require('express');
const serverless = require('serverless-http');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, message: 'API running' });
});

app.use('/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
  });
});

module.exports = {
  app,
  handler: serverless(app),
};
