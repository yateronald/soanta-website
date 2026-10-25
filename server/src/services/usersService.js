const bcrypt = require('bcryptjs');
const { query, queryOne } = require('../config/database');

const PUBLIC_COLUMNS = 'id, username, email, role, "createdAt"';

const USER_NOT_FOUND = {
  success: false,
  error: {
    code: 'NOT_FOUND',
    message: 'Utilisateur non trouvé'
  }
};

const DUPLICATE_EMAIL = {
  success: false,
  error: {
    code: 'DUPLICATE_ENTRY',
    message: 'Cet email est déjà utilisé'
  }
};

const INVALID_ROLE = {
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Rôle invalide'
  }
};

/**
 * Get all users (without passwords)
 * @returns {Promise<Object>} List of users
 */
async function getAllUsers() {
  const users = await query(`SELECT ${PUBLIC_COLUMNS} FROM users ORDER BY "createdAt" DESC`);

  return {
    success: true,
    data: users
  };
}

/**
 * Get a single user by ID (without password)
 * @param {number} id - User ID
 * @returns {Promise<Object>} User or error
 */
async function getUserById(id) {
  const user = await queryOne(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = $1`, [id]);
  if (!user) return USER_NOT_FOUND;

  return {
    success: true,
    data: user
  };
}

/**
 * Create a new user
 * @param {Object} data - User data
 * @returns {Promise<Object>} Created user or error
 */
async function createUser({ username, email, password, role = 'user' }) {
  // Check email uniqueness
  const existing = await queryOne('SELECT id FROM users WHERE email = $1', [email]);
  if (existing) return DUPLICATE_EMAIL;

  if (!['admin', 'user'].includes(role)) return INVALID_ROLE;

  const hashedPassword = bcrypt.hashSync(password, 10);

  // Return user without password
  const created = await queryOne(
    `INSERT INTO users (username, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING ${PUBLIC_COLUMNS}`,
    [username, email, hashedPassword, role]
  );

  return {
    success: true,
    data: created
  };
}

/**
 * Update a user
 * @param {number} id - User ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated user or error
 */
async function updateUser(id, { username, email, password, role }) {
  const existing = await queryOne('SELECT id, email FROM users WHERE id = $1', [id]);
  if (!existing) return USER_NOT_FOUND;

  // Check email uniqueness if changing email
  if (email && email !== existing.email) {
    const emailExists = await queryOne('SELECT id FROM users WHERE email = $1 AND id != $2', [email, id]);
    if (emailExists) return DUPLICATE_EMAIL;
  }

  if (role && !['admin', 'user'].includes(role)) return INVALID_ROLE;

  // Build update query
  const updates = [];
  const params = [];
  const set = (column, value) => {
    params.push(value);
    updates.push(`${column} = $${params.length}`);
  };

  if (username) set('username', username);
  if (email) set('email', email);
  if (password) set('password', bcrypt.hashSync(password, 10));
  if (role) set('role', role);

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
  const updated = await queryOne(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${params.length} RETURNING ${PUBLIC_COLUMNS}`,
    params
  );

  return {
    success: true,
    data: updated
  };
}

/**
 * Delete a user
 * @param {number} id - User ID
 * @returns {Promise<Object>} Success or error
 */
async function deleteUser(id) {
  const removed = await queryOne('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  if (!removed) return USER_NOT_FOUND;

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
