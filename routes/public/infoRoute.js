const express = require('express');
const router = express.Router();

router.get('/info', (req, res) => {
  res.json({ 
    version: '1.0.0', 
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;