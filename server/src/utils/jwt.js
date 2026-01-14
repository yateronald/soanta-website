const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate a secure secret if not provided via environment variable
// In production, ALWAYS use a strong secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Warn if using default secret in production
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: JWT_SECRET not set in production environment!');
}

/**
 * Sign a JWT token with user payload
 * @param {Object} payload - User data to encode
 * @returns {string} JWT token
 */
function signToken(payload) {
  // Don't include sensitive data in token
  const safePayload = {
    id: payload.id,
    email: payload.email,
    role: payload.role
  };
  
  return jwt.sign(safePayload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256'
  });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload or null if invalid
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'] // Only allow HS256 algorithm
    });
  } catch (error) {
    return null;
  }
}

module.exports = {
  signToken,
  verifyToken
};
