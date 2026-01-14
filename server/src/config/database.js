const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initializeDatabase() {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create demandes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS demandes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      email TEXT NOT NULL,
      telephone TEXT,
      entreprise TEXT,
      typePartenariat TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'Nouveau' CHECK(status IN ('Nouveau', 'En attente', 'Traité')),
      isDeleted INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Add telephone column if it doesn't exist (for existing databases)
  try {
    db.exec(`ALTER TABLE demandes ADD COLUMN telephone TEXT`);
  } catch (e) {
    // Column already exists, ignore
  }

  // Seed default admin user if not exists
  seedDefaultAdmin();
}

function seedDefaultAdmin() {
  // Create admin user with username 'admin' and password 'Admin@123'
  const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  
  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync('Admin@123', 10);
    db.prepare(`
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `).run('admin', 'admin@soanta.com', hashedPassword, 'admin');
    console.log('Default admin user created: username=admin, password=Admin@123');
  } else {
    // Update existing admin password to the new one
    const hashedPassword = bcrypt.hashSync('Admin@123', 10);
    db.prepare(`UPDATE users SET password = ? WHERE username = ?`).run(hashedPassword, 'admin');
  }
}

module.exports = {
  db,
  initializeDatabase
};
