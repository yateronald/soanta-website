const { body, validationResult } = require('express-validator');

/**
 * Validation rules for creating a demande
 */
const demandeValidationRules = [
  body('nom')
    .trim()
    .notEmpty()
    .withMessage('Le champ nom est requis')
    .isLength({ max: 100 })
    .withMessage('Le nom ne peut pas dépasser 100 caractères'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Le champ email est requis')
    .isEmail()
    .withMessage('Format d\'email invalide'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Le champ message est requis')
    .isLength({ max: 2000 })
    .withMessage('Le message ne peut pas dépasser 2000 caractères'),
  
  body('entreprise')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Le nom d\'entreprise ne peut pas dépasser 100 caractères'),
  
  body('typePartenariat')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Le type de partenariat ne peut pas dépasser 100 caractères')
];

/**
 * Validation rules for updating demande status
 */
const statusValidationRules = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Le statut est requis')
    .isIn(['Nouveau', 'En attente', 'Traité'])
    .withMessage('Statut invalide. Valeurs acceptées: Nouveau, En attente, Traité')
];

/**
 * Middleware to handle validation errors
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Données invalides',
        details: errors.array().reduce((acc, err) => {
          acc[err.path] = err.msg;
          return acc;
        }, {})
      }
    });
  }
  
  next();
}

module.exports = {
  demandeValidationRules,
  statusValidationRules,
  handleValidationErrors
};
