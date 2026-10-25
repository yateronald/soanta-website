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
  // Admin credentials can be overridden with ADMIN_EMAIL / ADMIN_PASSWORD (e.g. on Render)
  const email = (process.env.ADMIN_EMAIL || 'exportinfos@soanta.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const hashedPassword = bcrypt.hashSync(password, 10);

  const existingAdmin =
    db.prepare('SELECT id FROM users WHERE email = ?').get(email) ||
    db.prepare('SELECT id FROM users WHERE username = ?').get('admin');

  if (!existingAdmin) {
    db.prepare(`
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `).run('admin', email, hashedPassword, 'admin');
    console.log(`Default admin user created: ${email}`);
  } else {
    // Keep the admin account in sync with the configured email and password
    db.prepare(`UPDATE users SET email = ?, password = ?, role = 'admin' WHERE id = ?`)
      .run(email, hashedPassword, existingAdmin.id);
  }
}

module.exports = {
  db,
  initializeDatabase
};
