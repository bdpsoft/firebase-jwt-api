class TokenCache {
  constructor(cleanupInterval = 300000) {
    this.cache = new Map();
    // Clean up expired tokens every 5 minutes
    setInterval(() => this.cleanup(), cleanupInterval);
  }

  get(token) {
    const entry = this.cache.get(token);
    if (!entry) return null;
    
    // Check if token is still valid
    if (Date.now() > entry.expiresAt) {
      this.delete(token);
      return null;
    }
    
    return entry.decodedToken;
  }

  set(token, decodedToken, maxAge = 300000) {
    const expiresAt = Date.now() + maxAge;
    this.cache.set(token, { decodedToken, expiresAt });
    
    // Set automatic invalidation
    setTimeout(() => {
      if (this.cache.get(token)?.expiresAt === expiresAt) {
        this.delete(token);
      }
    }, maxAge);
  }

  delete(token) {
    this.cache.delete(token);
  }

  cleanup() {
    const now = Date.now();
    for (const [token, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.delete(token);
      }
    }
  }

  getStats(){
    return this.cache.size;
  }
}

module.exports = new TokenCache();