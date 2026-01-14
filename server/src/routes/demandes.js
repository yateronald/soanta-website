const express = require('express');
const demandesService = require('../services/demandesService');
const authMiddleware = require('../middleware/auth');
const { demandeValidationRules, statusValidationRules, handleValidationErrors } = require('../middleware/validate');
const { formLimiter, validateIdParam } = require('../middleware/security');

const router = express.Router();

// GET /api/demandes - List all demandes with pagination, filter, search
router.get('/', authMiddleware, (req, res) => {
  const { page = 1, limit = 10, status, search, includeDeleted } = req.query;
  
  // Validate pagination params
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10)); // Max 100 items per page
  
  const result = demandesService.getAllDemandes({
    page: pageNum,
    limit: limitNum,
    status,
    search,
    includeDeleted: includeDeleted === 'true'
  });

  res.json(result);
});

// GET /api/demandes/:id - Get single demande
router.get('/:id', authMiddleware, validateIdParam, (req, res) => {
  const { id } = req.params;
  const result = demandesService.getDemandeById(id);

  if (!result.success) {
    return res.status(404).json(result);
  }

  res.json(result);
});

// POST /api/demandes - Create new demande (public endpoint for contact form)
// Apply form rate limiting to prevent spam
router.post('/', formLimiter, demandeValidationRules, handleValidationErrors, (req, res) => {
  const { nom, email, telephone, entreprise, typePartenariat, message } = req.body;
  
  const result = demandesService.createDemande({
    nom,
    email,
    telephone,
    entreprise,
    typePartenariat,
    message
  });

  res.status(201).json(result);
});

// PUT /api/demandes/:id/status - Update demande status
router.put('/:id/status', authMiddleware, validateIdParam, statusValidationRules, handleValidationErrors, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const result = demandesService.updateDemandeStatus(id, status);

  if (!result.success) {
    const statusCode = result.error.code === 'NOT_FOUND' ? 404 : 400;
    return res.status(statusCode).json(result);
  }

  res.json(result);
});

// DELETE /api/demandes/:id - Soft delete demande
router.delete('/:id', authMiddleware, validateIdParam, (req, res) => {
  const { id } = req.params;
  const result = demandesService.softDeleteDemande(id);

  if (!result.success) {
    return res.status(404).json(result);
  }

  res.json(result);
});

// POST /api/demandes/:id/restore - Restore soft-deleted demande
router.post('/:id/restore', authMiddleware, validateIdParam, (req, res) => {
  const { id } = req.params;
  const result = demandesService.restoreDemande(id);

  if (!result.success) {
    return res.status(404).json(result);
  }

  res.json(result);
});

// DELETE /api/demandes/:id/permanent - Permanently delete demande
router.delete('/:id/permanent', authMiddleware, validateIdParam, (req, res) => {
  const { id } = req.params;
  const result = demandesService.permanentDeleteDemande(id);

  if (!result.success) {
    return res.status(404).json(result);
  }

  res.json(result);
});

module.exports = router;
