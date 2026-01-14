const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');
const demandesRoutes = require('./routes/demandes');
const usersRoutes = require('./routes/users');
const {
  generalLimiter,
  helmetConfig,
  sanitizeBody,
  sanitizeQuery,
  securityHeaders,
  hpp
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize database
initializeDatabase();

// Security middleware (apply before other middleware)
app.use(helmetConfig);
app.use(securityHeaders);
app.use(hpp); // Prevent HTTP Parameter Pollution

// CORS configuration - restrict to specific origins
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'https://soanta.com',
  'https://www.soanta.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
}));

// Body parsing with size limits
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitize inputs
app.use(sanitizeBody);
app.use(sanitizeQuery);

// Apply general rate limiting to all routes
app.use('/api/', generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/demandes', demandesRoutes);
app.use('/api/users', usersRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint non trouvé'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Don't leak error details in production
  const isDev = process.env.NODE_ENV === 'development';
  
  // Handle specific error types
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'La requête est trop volumineuse'
      }
    });
  }
  
  console.error('Server error:', isDev ? err : err.message);
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erreur interne du serveur'
    }
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
