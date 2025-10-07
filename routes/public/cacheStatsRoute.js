const express = require('express');
const router = express.Router();
const tokenCache = require('../../utils/tokenCache');

router.get('/cache-stats', (req, res) => {
  res.json({
    message: 'Token cache statistics',
    stats: tokenCache.getStats(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;