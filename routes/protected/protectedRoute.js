const express = require('express');
const router = express.Router();
const withAuth = require('../../middleware/authWrapper');

// Protected route wrapped with authentication
router.get('/protected', withAuth((req, res) => {
  res.json({ 
    message: 'Protected endpoint - access granted',
    user: req.user
  });
}));

module.exports = router;