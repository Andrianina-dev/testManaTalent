const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'apitest',
    port: parseInt(process.env.DB_PORT) || 3306, // Conversion en nombre
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    const connection = await pool.getConnection();
    console.log('Connecté à la base de données MySQL!');
    connection.release();
  } catch (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
    process.exit(1);
  }
}

function getPool() {
  if (!pool) {
    throw new Error('La base de données n\'a pas été initialisée. Appelez initDB() d\'abord.');
  }
  return pool;
}

module.exports = { initDB, getPool };