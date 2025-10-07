const express = require('express');
const router = express.Router();
const withAuth = require('../../middleware/authWrapper');

router.get('/settings', withAuth((req, res) => {
  res.json({
    message: 'User settings',
    preferences: {
      theme: 'dark',
      notifications: true
    },
    last_updated: new Date().toISOString()
  });
}));

module.exports = router;