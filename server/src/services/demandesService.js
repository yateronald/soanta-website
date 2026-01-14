const { db } = require('../config/database');

/**
 * Get all demandes with pagination, filtering, and search
 * @param {Object} options - Query options
 * @returns {Object} Paginated demandes with stats
 */
function getAllDemandes({ page = 1, limit = 10, status, search, includeDeleted = false }) {
  const offset = (page - 1) * limit;
  let whereConditions = [];
  let params = [];

  // Filter by deleted status
  if (!includeDeleted) {
    whereConditions.push('isDeleted = 0');
  }

  // Filter by status
  if (status && ['Nouveau', 'En attente', 'Traité'].includes(status)) {
    whereConditions.push('status = ?');
    params.push(status);
  }

  // Search by nom, email, or entreprise
  if (search) {
    whereConditions.push('(nom LIKE ? OR email LIKE ? OR entreprise LIKE ?)');
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM demandes ${whereClause}`;
  const { total } = db.prepare(countQuery).get(...params);

  // Get paginated data
  const dataQuery = `
    SELECT * FROM demandes 
    ${whereClause}
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `;
  const data = db.prepare(dataQuery).all(...params, limit, offset);

  // Get stats (only non-deleted)
  const stats = getStats();

  return {
    success: true,
    data: {
      demandes: data,
      total,
      page,
      limit,
      stats
    }
  };
}

/**
 * Get demande statistics
 * @returns {Object} Stats object
 */
function getStats() {
  const statsQuery = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'Nouveau' THEN 1 ELSE 0 END) as nouveau,
      SUM(CASE WHEN status = 'En attente' THEN 1 ELSE 0 END) as enAttente,
      SUM(CASE WHEN status = 'Traité' THEN 1 ELSE 0 END) as traite
    FROM demandes
    WHERE isDeleted = 0
  `;
  return db.prepare(statsQuery).get();
}

/**
 * Get a single demande by ID
 * @param {number} id - Demande ID
 * @returns {Object} Demande or error
 */
function getDemandeById(id) {
  const demande = db.prepare('SELECT * FROM demandes WHERE id = ?').get(id);

  if (!demande) {
    return {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Ressource non trouvée'
      }
    };
  }

  return {
    success: true,
    data: demande
  };
}

/**
 * Create a new demande
 * @param {Object} data - Demande data
 * @returns {Object} Created demande
 */
function createDemande({ nom, email, telephone, entreprise, typePartenariat, message }) {
  // Only allow specific fields - prevent mass assignment
  // Status and isDeleted are NOT accepted from user input
  const stmt = db.prepare(`
    INSERT INTO demandes (nom, email, telephone, entreprise, typePartenariat, message, status, isDeleted)
    VALUES (?, ?, ?, ?, ?, ?, 'Nouveau', 0)
  `);

  const result = stmt.run(nom, email, telephone || null, entreprise || null, typePartenariat || null, message);
  const created = db.prepare('SELECT * FROM demandes WHERE id = ?').get(result.lastInsertRowid);

  return {
    success: true,
    data: created
  };
}

/**
 * Update demande status
 * @param {number} id - Demande ID
 * @param {string} status - New status
 * @returns {Object} Updated demande or error
 */
function updateDemandeStatus(id, status) {
  if (!['Nouveau', 'En attente', 'Traité'].includes(status)) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Statut invalide'
      }
    };
  }

  const existing = db.prepare('SELECT * FROM demandes WHERE id = ?').get(id);
  if (!existing) {
    return {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Ressource non trouvée'
      }
    };
  }

  db.prepare(`
    UPDATE demandes 
    SET status = ?, updatedAt = CURRENT_TIMESTAMP 
    WHERE id = ?
  `).run(status, id);

  const updated = db.prepare('SELECT * FROM demandes WHERE id = ?').get(id);

  return {
    success: true,
    data: updated
  };
}

/**
 * Soft delete a demande
 * @param {number} id - Demande ID
 * @returns {Object} Success or error
 */
function softDeleteDemande(id) {
  const existing = db.prepare('SELECT * FROM demandes WHERE id = ?').get(id);
  if (!existing) {
    return {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Ressource non trouvée'
      }
    };
  }

  db.prepare(`
    UPDATE demandes 
    SET isDeleted = 1, updatedAt = CURRENT_TIMESTAMP 
    WHERE id = ?
  `).run(id);

  return {
    success: true,
    message: 'Demande supprimée'
  };
}

/**
 * Restore a soft-deleted demande
 * @param {number} id - Demande ID
 * @returns {Object} Restored demande or error
 */
function restoreDemande(id) {
  const existing = db.prepare('SELECT * FROM demandes WHERE id = ?').get(id);
  if (!existing) {
    return {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Ressource non trouvée'
      }
    };
  }

  db.prepare(`
    UPDATE demandes 
    SET isDeleted = 0, updatedAt = CURRENT_TIMESTAMP 
    WHERE id = ?
  `).run(id);

  const restored = db.prepare('SELECT * FROM demandes WHERE id = ?').get(id);

  return {
    success: true,
    data: restored
  };
}

/**
 * Permanently delete a demande from the database
 * @param {number} id - Demande ID
 * @returns {Object} Success or error
 */
function permanentDeleteDemande(id) {
  const existing = db.prepare('SELECT * FROM demandes WHERE id = ?').get(id);
  if (!existing) {
    return {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Ressource non trouvée'
      }
    };
  }

  db.prepare('DELETE FROM demandes WHERE id = ?').run(id);

  return {
    success: true,
    message: 'Demande supprimée définitivement'
  };
}

module.exports = {
  getAllDemandes,
  getDemandeById,
  createDemande,
  updateDemandeStatus,
  softDeleteDemande,
  restoreDemande,
  permanentDeleteDemande,
  getStats
};
