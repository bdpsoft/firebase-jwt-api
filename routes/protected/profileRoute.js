const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/auth');

router.get('/profile', authenticate, (req, res) => {
  res.json({
    user: {
      provider_id: req.user.firebase.sign_in_provider,
      uid: req.user.uid,
      email: req.user.email  || null,
      name: req.user.name || 'Unknown',
      auth_time: new Date(req.user.auth_time * 1000).toISOString()
    },
    token_info: {
      issued_at: new Date(req.user.iat * 1000).toISOString(),
      expires_at: new Date(req.user.exp * 1000).toISOString()
    }
  });
});

module.exports = router;