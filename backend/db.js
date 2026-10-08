const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

const connectDB = async () => {
  await pool.query('SELECT 1');
  console.log('✅ PostgreSQL Connected');
};

module.exports = { pool, connectDB };