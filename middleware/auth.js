const { verifyJWT } = require('../utils/jwtUtils.js');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Authorization header missing or malformed',
      code: 'MISSING_AUTH_HEADER'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token with signature AND issuer check
    const decoded = await verifyJWT(token);
    req.user = decoded;
    next();
  } catch (error) {
    let status = 403;
    let message = 'Invalid token';
    
    if (error.message.includes('issuer')) {
      status = 403;
      message = 'Token not issued by this Firebase project';
    } else if (error.code === 'auth/id-token-expired') {
      status = 401;
      message = 'Token expired';
    }
    
    res.status(status).json({ 
      error: message,
      code: error.code || 'TOKEN_VERIFICATION_FAILED'
    });
  }
};

module.exports = authenticate;