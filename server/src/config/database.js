const { Pool, types } = require('pg');
const bcrypt = require('bcryptjs');

// COUNT()/SUM() return BIGINT, which pg hands back as strings by default
types.setTypeParser(20, (value) => parseInt(value, 10));

function sslConfig() {
  if (process.env.DB_SSL !== 'true') return false;
  // With the provider's CA certificate we can fully verify the server;
  // otherwise keep the connection encrypted without certificate verification.
  if (process.env.DB_CA_CERT) {
    return { ca: process.env.DB_CA_CERT.replace(/\\n/g, '\n'), rejectUnauthorized: true };
  }
  return { rejectUnauthorized: false };
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: sslConfig(),
  max: parseInt(process.env.DB_POOL_MAX || '5', 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});

pool.on('error', (err) => {
  // An idle client lost its connection; the pool will create a new one on demand
  console.error('PostgreSQL pool error:', err.message);
});

/**
 * Run a query and return all rows
 */
async function query(text, params = []) {
  const { rows } = await pool.query(text, params);
  return rows;
}

/**
 * Run a query and return the first row (or undefined)
 */
async function queryOne(text, params = []) {
  const rows = await query(text, params);
  return rows[0];
}

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS demandes (
      id SERIAL PRIMARY KEY,
      nom TEXT NOT NULL,
      email TEXT NOT NULL,
      telephone TEXT,
      entreprise TEXT,
      "typePartenariat" TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Nouveau' CHECK (status IN ('Nouveau', 'En attente', 'Traité')),
      "isDeleted" SMALLINT NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS demandes_list_idx ON demandes ("isDeleted", "createdAt" DESC)
  `);

  await seedDefaultAdmin();
}

/**
 * Make sure the default admin account exists.
 * Its password is only set on creation (so changes made from the admin panel
 * survive restarts), unless ADMIN_RESET_PASSWORD=true is set to recover access.
 */
async function seedDefaultAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'exportinfos@soanta.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  const existingAdmin = await queryOne('SELECT id FROM users WHERE email = $1', [email]);

  if (!existingAdmin) {
    await pool.query(
      `INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, 'admin')`,
      ['admin', email, bcrypt.hashSync(password, 10)]
    );
    console.log(`Default admin user created: ${email}`);
    return;
  }

  if (process.env.ADMIN_RESET_PASSWORD === 'true') {
    await pool.query(
      `UPDATE users SET password = $1, role = 'admin' WHERE id = $2`,
      [bcrypt.hashSync(password, 10), existingAdmin.id]
    );
    console.log(`Admin password reset for ${email}`);
  }
}

module.exports = {
  pool,
  query,
  queryOne,
  initializeDatabase
};
