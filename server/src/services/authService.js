const bcrypt = require('bcryptjs');
const { queryOne } = require('../config/database');
const { signToken, verifyToken } = require('../utils/jwt');

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Result with token and user or error
 */
async function login(email, password) {
  const user = await queryOne('SELECT * FROM users WHERE email = $1', [email]);

  if (!user) {
    return {
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Email ou mot de passe incorrect'
      }
    };
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);

  if (!isValidPassword) {
    return {
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Email ou mot de passe incorrect'
      }
    };
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role
  });

  return {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }
  };
}

/**
 * Verify user session from token
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Result with user or error
 */
async function verifySession(token) {
  const decoded = verifyToken(token);

  if (!decoded) {
    return {
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Session expirée'
      }
    };
  }

  // Verify user still exists in database
  const user = await queryOne('SELECT id, username, email, role, "createdAt" FROM users WHERE id = $1', [decoded.id]);

  if (!user) {
    return {
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Utilisateur non trouvé'
      }
    };
  }

  return {
    success: true,
    data: { user }
  };
}

module.exports = {
  login,
  verifySession
};
