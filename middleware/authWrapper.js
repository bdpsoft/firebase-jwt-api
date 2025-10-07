const authenticateJWT = require('./auth');

const withAuth = (handler) => {
  return async (req, res) => {
    // Create a next function that will either proceed or handle errors
    const next = (error) => {
      if (error) {
        console.error('Authentication error:', error);
        return res.status(error.status || 401).json({ error: error.message });
      }
      // If authentication passes, execute the route handler
      return handler(req, res);
    };

    // Execute authentication middleware
    await authenticateJWT(req, res, next);
  };
};

module.exports = withAuth;