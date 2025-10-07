const admin = require('../config/firebase');
const tokenCache = require('../utils/tokenCache');

// Verify JWT with caching and proper signature verification
const verifyJWT = async (idToken) => {
  // 1. Check cache
  const cached = tokenCache.get(idToken);
  if (cached) {
    // If token is cached, return it immediately
    return cached; 
  }

  try {
    // 2. Verify signature AND issuer with Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // 3. Validate issuer explicitly
    const expectedIssuer = `https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}`;
    if (decodedToken.iss !== expectedIssuer) {
      throw new Error('Invalid token issuer');
    }
    
    // 4. Cache valid token

    const expiresIn = Math.min(
      (decodedToken.exp * 1000) - Date.now(), // Time until expiration
      300000 // Max cache time (5 minutes)
    );
    
    if (expiresIn > 0) {
      tokenCache.set(idToken, decodedToken, expiresIn);
    }
    
    return decodedToken;
  } catch (error) {
    // Remove from cache if verification fails
    tokenCache.delete(idToken);
    throw error;
  }
};

module.exports = { verifyJWT };