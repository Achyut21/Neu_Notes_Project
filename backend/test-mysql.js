// test-mysql.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Initialize dotenv to load environment variables
dotenv.config();

// Get database configuration from environment variables or use defaults
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'neunotes'
};

// Function to test the connection
async function testConnection() {
  let connection;
  
  try {
    console.log('Attempting to connect to MySQL with the following config:');
    console.log(`Host: ${dbConfig.host}`);
    console.log(`Port: ${dbConfig.port}`);
    console.log(`User: ${dbConfig.user}`);
    console.log(`Database: ${dbConfig.database}`);
    
    // Create a connection
    connection = await mysql.createConnection(dbConfig);
    
    // Test the connection with a simple query
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    
    console.log('✅ MySQL connection successful!');
    console.log('Query result:', rows[0].result);
    
    // Try to get database tables to verify database exists
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('⚠️ Connected to database, but no tables found.');
    } else {
      console.log('📋 Tables in database:');
      tables.forEach(table => {
        // Get the table name (property name varies by MySQL version)
        const tableName = Object.values(table)[0];
        console.log(`- ${tableName}`);
      });
    }
    
  } catch (error) {
    console.error('❌ MySQL connection failed:');
    console.error(error);
    
    // Provide more helpful error messages based on error code
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Hint: Check your username and password');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Hint: Make sure MySQL server is running');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`💡 Hint: Database '${dbConfig.database}' does not exist. Create it first.`);
    }
  } finally {
    // Close the connection if it was established
    if (connection) {
      await connection.end();
      console.log('Connection closed');
    }
  }
}

// Run the test
testConnection();