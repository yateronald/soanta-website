const { query, queryOne } = require('../config/database');

const STATUSES = ['Nouveau', 'En attente', 'Traité'];

const NOT_FOUND = {
  success: false,
  error: {
    code: 'NOT_FOUND',
    message: 'Ressource non trouvée'
  }
};

/**
 * Get all demandes with pagination, filtering, and search
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Paginated demandes with stats
 */
async function getAllDemandes({ page = 1, limit = 10, status, search, includeDeleted = false }) {
  const offset = (page - 1) * limit;
  const whereConditions = [];
  const params = [];

  // Filter by deleted status
  if (!includeDeleted) {
    whereConditions.push('"isDeleted" = 0');
  }

  // Filter by status
  if (status && STATUSES.includes(status)) {
    params.push(status);
    whereConditions.push(`status = $${params.length}`);
  }

  // Search by nom, email, or entreprise (case-insensitive)
  if (search) {
    params.push(`%${search}%`);
    const p = `$${params.length}`;
    whereConditions.push(`(nom ILIKE ${p} OR email ILIKE ${p} OR entreprise ILIKE ${p})`);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  const { total } = await queryOne(`SELECT COUNT(*) AS total FROM demandes ${whereClause}`, params);

  const data = await query(
    `SELECT * FROM demandes
     ${whereClause}
     ORDER BY "createdAt" DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );

  // Stats (only non-deleted)
  const stats = await getStats();

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
 * @returns {Promise<Object>} Stats object
 */
async function getStats() {
  return queryOne(`
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'Nouveau') AS nouveau,
      COUNT(*) FILTER (WHERE status = 'En attente') AS "enAttente",
      COUNT(*) FILTER (WHERE status = 'Traité') AS traite
    FROM demandes
    WHERE "isDeleted" = 0
  `);
}

/**
 * Get a single demande by ID
 * @param {number} id - Demande ID
 * @returns {Promise<Object>} Demande or error
 */
async function getDemandeById(id) {
  const demande = await queryOne('SELECT * FROM demandes WHERE id = $1', [id]);
  if (!demande) return NOT_FOUND;

  return {
    success: true,
    data: demande
  };
}

/**
 * Create a new demande
 * @param {Object} data - Demande data
 * @returns {Promise<Object>} Created demande
 */
async function createDemande({ nom, email, telephone, entreprise, typePartenariat, message }) {
  // Only allow specific fields - prevent mass assignment
  // Status and isDeleted are NOT accepted from user input
  const created = await queryOne(
    `INSERT INTO demandes (nom, email, telephone, entreprise, "typePartenariat", message, status, "isDeleted")
     VALUES ($1, $2, $3, $4, $5, $6, 'Nouveau', 0)
     RETURNING *`,
    [nom, email, telephone || null, entreprise || null, typePartenariat || null, message]
  );

  return {
    success: true,
    data: created
  };
}

/**
 * Update demande status
 * @param {number} id - Demande ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated demande or error
 */
async function updateDemandeStatus(id, status) {
  if (!STATUSES.includes(status)) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Statut invalide'
      }
    };
  }

  const updated = await queryOne(
    `UPDATE demandes SET status = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  );
  if (!updated) return NOT_FOUND;

  return {
    success: true,
    data: updated
  };
}

/**
 * Soft delete a demande
 * @param {number} id - Demande ID
 * @returns {Promise<Object>} Success or error
 */
async function softDeleteDemande(id) {
  const deleted = await queryOne(
    `UPDATE demandes SET "isDeleted" = 1, "updatedAt" = NOW() WHERE id = $1 RETURNING id`,
    [id]
  );
  if (!deleted) return NOT_FOUND;

  return {
    success: true,
    message: 'Demande supprimée'
  };
}

/**
 * Restore a soft-deleted demande
 * @param {number} id - Demande ID
 * @returns {Promise<Object>} Restored demande or error
 */
async function restoreDemande(id) {
  const restored = await queryOne(
    `UPDATE demandes SET "isDeleted" = 0, "updatedAt" = NOW() WHERE id = $1 RETURNING *`,
    [id]
  );
  if (!restored) return NOT_FOUND;

  return {
    success: true,
    data: restored
  };
}

/**
 * Permanently delete a demande from the database
 * @param {number} id - Demande ID
 * @returns {Promise<Object>} Success or error
 */
async function permanentDeleteDemande(id) {
  const removed = await queryOne('DELETE FROM demandes WHERE id = $1 RETURNING id', [id]);
  if (!removed) return NOT_FOUND;

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
