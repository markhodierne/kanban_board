const { Pool } = require('pg');

// PostgreSQL connection pool configuration
// Uses environment variables with sensible defaults per ARCHITECTURE.md
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kanban_board',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  // Connection pool settings for development
  max: 10, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return error after 2 seconds if connection cannot be established
});

// Handle pool connection errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Export query method that uses parameterized queries for security
module.exports = {
  query: async (text, params) => {
    try {
      const result = await pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
  // Export pool for advanced usage if needed
  pool: pool
};