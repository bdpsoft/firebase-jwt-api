const express = require('express');
const router = express.Router();

router.get('/public', (req, res) => {
  res.json({ message: 'Public endpoint - no auth needed' });
});

module.exports = router;