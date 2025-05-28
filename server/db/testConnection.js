// Test script to verify database connection
// Run with: node server/db/testConnection.js

require('dotenv').config();
const db = require('./connection');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await db.query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful');
    console.log('Current time from database:', result.rows[0].current_time);
    
    // Test if tasks table exists (will fail if schema not yet applied)
    try {
      const tableTest = await db.query('SELECT COUNT(*) FROM tasks');
      console.log('✅ Tasks table exists with', tableTest.rows[0].count, 'records');
      
      // Show sample data
      const sampleData = await db.query('SELECT id, title, status FROM tasks LIMIT 3');
      console.log('Sample tasks:');
      sampleData.rows.forEach(task => {
        console.log(`  ${task.id}: ${task.title} (${task.status})`);
      });
      
    } catch (tableError) {
      console.log('⚠️  Tasks table not found. Run: npm run db:setup');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('Make sure PostgreSQL is running and .env file is configured');
    process.exit(1);
  }
}

testConnection();