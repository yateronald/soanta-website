const express = require('express');
const { body, validationResult } = require('express-validator');
const usersService = require('../services/usersService');
const authMiddleware = require('../middleware/auth');
const { validateIdParam } = require('../middleware/security');

const router = express.Router();

// Validation rules for creating a user
const createUserValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Le nom d\'utilisateur est requis')
    .isLength({ min: 3, max: 50 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 50 caractères'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('L\'email est requis')
    .isEmail()
    .withMessage('Format d\'email invalide'),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Rôle invalide')
];

// Validation rules for updating a user
const updateUserValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 50 caractères'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Format d\'email invalide'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Rôle invalide')
];

// Handle validation errors
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

// GET /api/users - List all users
router.get('/', authMiddleware, (req, res) => {
  const result = usersService.getAllUsers();
  res.json(result);
});

// GET /api/users/:id - Get single user
router.get('/:id', authMiddleware, validateIdParam, (req, res) => {
  const { id } = req.params;
  const result = usersService.getUserById(id);

  if (!result.success) {
    return res.status(404).json(result);
  }

  res.json(result);
});

// POST /api/users - Create new user
router.post('/', authMiddleware, createUserValidation, handleValidationErrors, (req, res) => {
  const { username, email, password, role } = req.body;
  
  const result = usersService.createUser({
    username,
    email,
    password,
    role
  });

  if (!result.success) {
    const statusCode = result.error.code === 'DUPLICATE_ENTRY' ? 409 : 400;
    return res.status(statusCode).json(result);
  }

  res.status(201).json(result);
});

// PUT /api/users/:id - Update user
router.put('/:id', authMiddleware, validateIdParam, updateUserValidation, handleValidationErrors, (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  
  const result = usersService.updateUser(id, {
    username,
    email,
    password,
    role
  });

  if (!result.success) {
    const statusCode = result.error.code === 'NOT_FOUND' ? 404 : 
                       result.error.code === 'DUPLICATE_ENTRY' ? 409 : 400;
    return res.status(statusCode).json(result);
  }

  res.json(result);
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', authMiddleware, validateIdParam, (req, res) => {
  const { id } = req.params;
  const result = usersService.deleteUser(id);

  if (!result.success) {
    return res.status(404).json(result);
  }

  res.json(result);
});

module.exports = router;
