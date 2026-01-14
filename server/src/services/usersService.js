const bcrypt = require('bcryptjs');
const { db } = require('../config/database');

/**
 * Get all users (without passwords)
 * @returns {Object} List of users
 */
function getAllUsers() {
  const users = db.prepare(`
    SELECT id, username, email, role, createdAt 
    FROM users 
    ORDER BY createdAt DESC
  `).all();

  return {
    success: true,
    data: users
  };
}

/**
 * Get a single user by ID (without password)
 * @param {number} id - User ID
 * @returns {Object} User or error
 */
function getUserById(id) {
  const user = db.prepare(`
    SELECT id, username, email, role, createdAt 
    FROM users 
    WHERE id = ?
  `).get(id);

  if (!user) {
    return {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Utilisateur non trouvé'
      }
    };
  }

  return {
    success: true,
    data: user
  };
}

/**
 * Create a new user
 * @param {Object} data - User data
 * @returns {Object} Created user or error
 */
function createUser({ username, email, password, role = 'user' }) {
  // Check email uniqueness
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return {
      success: false,
      error: {
        code: 'DUPLICATE_ENTRY',
        message: 'Cet email est déjà utilisé'
      }
    };
  }

  // Validate role
  if (!['admin', 'user'].includes(role)) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Rôle invalide'
      }
    };
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  const stmt = db.prepare(`
    INSERT INTO users (username, email, password, role)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(username, email, hashedPassword, role);

  // Return user without password
  const created = db.prepare(`
    SELECT id, username, email, role, createdAt 
    FROM users 
    WHERE id = ?
  `).get(result.lastInsertRowid);

  return {
    success: true,
    data: created
  };
}

/**
 * Update a user
 * @param {number} id - User ID
 * @param {Object} data - Update data
 * @returns {Object} Updated user or error
 */
function updateUser(id, { username, email, password, role }) {
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!existing) {
    return {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Utilisateur non trouvé'
      }
    };
  }

  // Check email uniqueness if changing email
  if (email && email !== existing.email) {
    const emailExists = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, id);
    if (emailExists) {
      return {
        success: false,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: 'Cet email est déjà utilisé'
        }
      };
    }
  }

  // Validate role if provided
  if (role && !['admin', 'user'].includes(role)) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Rôle invalide'
      }
    };
  }

  // Build update query
  const updates = [];
  const params = [];

  if (username) {
    updates.push('username = ?');
    params.push(username);
  }
  if (email) {
    updates.push('email = ?');
    params.push(email);
  }
  if (password) {
    updates.push('password = ?');
    params.push(bcrypt.hashSync(password, 10));
  }
  if (role) {
    updates.push('role = ?');
    params.push(role);
  }

  if (updates.length === 0) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Aucune donnée à mettre à jour'
      }
    };
  }

  params.push(id);
  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  // Return updated user without password
  const updated = db.prepare(`
    SELECT id, username, email, role, createdAt 
    FROM users 
    WHERE id = ?
  `).get(id);

  return {
    success: true,
    data: updated
  };
}

/**
 * Delete a user
 * @param {number} id - User ID
 * @returns {Object} Success or error
 */
function deleteUser(id) {
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!existing) {
    return {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Utilisateur non trouvé'
      }
    };
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(id);

  return {
    success: true,
    message: 'Utilisateur supprimé'
  };
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
