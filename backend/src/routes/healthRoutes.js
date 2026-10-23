const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'REVERSELY Marketplace Backend API',
    environment: process.env.NODE_ENV || 'development',
    database: states[dbState] || 'unknown',
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

module.exports = router;
