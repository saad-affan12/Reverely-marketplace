require('dotenv').config();
const app = require('./src/app');
const { connectDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () => {
      console.log(`[REVERSELY Server] Running on http://localhost:${PORT}`);
      console.log(`[REVERSELY Server] Health check available at http://localhost:${PORT}/api/health`);
    });

    const shutdown = async (signal) => {
      console.log(`[REVERSELY Server] ${signal} signal received. Closing HTTP server...`);
      server.close(() => {
        console.log('[REVERSELY Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('[REVERSELY Server] Startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
