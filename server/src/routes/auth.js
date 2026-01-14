const express = require('express');
const { body, validationResult } = require('express-validator');
const authService = require('../services/authService');
const authMiddleware = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

// POST /api/auth/login - Apply strict rate limiting
router.post('/login', authLimiter, [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('L\'email est requis')
    .isEmail()
    .withMessage('Format d\'email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis')
    .isLength({ min: 1, max: 128 })
    .withMessage('Mot de passe invalide')
], (req, res) => {
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

  const { email, password } = req.body;
  const result = authService.login(email, password);

  if (!result.success) {
    return res.status(401).json(result);
  }

  res.json(result);
});

// POST /api/auth/logout
router.post('/logout', authMiddleware, (req, res) => {
  // JWT is stateless, so logout is handled client-side by removing the token
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  
  const result = authService.verifySession(token);

  if (!result.success) {
    return res.status(401).json(result);
  }

  res.json(result);
});

module.exports = router;
