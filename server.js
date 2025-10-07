require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const { get: getEnv }  = require('env-var');

const app = express();
const port = getEnv('PORT').default(3000).asPortNumber();

// Middleware
app.use(cors({
  origin: getEnv('CORS_ORIGIN').default('*').asString(),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Load routes dynamically
const loadRoutes = (dir, prefix = '') => {
  const router = express.Router();
  const fullPath = path.join(__dirname, dir);
  
  fs.readdirSync(fullPath).forEach(file => {
    if (file.endsWith('.js')) {
      const routeModule = require(path.join(fullPath, file));
      router.use(routeModule);
    }
  });
  
  return router;
};

// Public routes
app.use('/api/v1', loadRoutes('./routes/public'));

// Protected routes
app.use('/api/v1', loadRoutes('./routes/protected'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});

// API documentation
app.get('/', (req, res) => {
  res.json({
    api: 'Firebase JWT Authentication API',
    version: '1.0.0',
    endpoints: {
      public: [
        { method: 'GET', path: '/api/v1/public' },
        { method: 'GET', path: '/api/v1/info' }
      ],
      protected: [
        { method: 'GET', path: '/api/v1/profile', auth: 'Bearer Token Required' }
      ],
      system: [
        { method: 'GET', path: '/health' }
      ]
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    suggestion: 'Visit / for available endpoints'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('\nAvailable routes:');
    console.log(`- Public:  http://localhost:${port}/api/v1/public`);
    console.log(`- Profile: http://localhost:${port}/api/v1/profile (protected)`);
    console.log(`- Health:  http://localhost:${port}/health`);
  }
});