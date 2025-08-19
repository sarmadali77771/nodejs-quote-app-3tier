const mysql = require('mysql2/promise');

const MAX_RETRIES = 10;
const RETRY_DELAY = 2000; // 2 seconds

// Create connection pool (simplified)
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'mysql',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'db_quotes',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
});

async function initializeDatabase() {
  try {
    console.log('Initializing database');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        text TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database table created or already exists');
    
    // Check if we need to add the initial quote
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM quotes');
    console.log(`Found ${rows[0].count} existing quotes in database`);
    
    if (rows[0].count === 0) {
      console.log('Adding initial quote to database');
      await pool.query(
        'INSERT INTO quotes (text, author) VALUES (?, ?)',
        [
          "Never give up, no matter how hard life gets no matter how much pain you feel. Pain will eventually subside, nothing remains forever, so keep going and don't give up.",
          "Imran Khan"
        ]
      );
      console.log('Initial quote added to database');
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

async function addQuote(text, author) {
  try {
    console.log('Adding quote to database:', { text, author });
    
    // Simple insert without transaction (to avoid complexity)
    const [result] = await pool.query(
      'INSERT INTO quotes (text, author) VALUES (?, ?)',
      [text, author]
    );
    console.log('Quote inserted with ID:', result.insertId);

    // Check if we have more than 50 quotes and delete old ones
    const [results] = await pool.query('SELECT COUNT(*) as count FROM quotes');
    const count = results[0].count;
    console.log(`Total quotes in database: ${count}`);

    if (count > 50) {
      await pool.query(`
        DELETE FROM quotes 
        WHERE id NOT IN (
          SELECT * FROM (
            SELECT id FROM quotes ORDER BY id DESC LIMIT 50
          ) AS temp
        )
      `);
      console.log('Deleted old quotes to maintain 50-quote limit');
    }

    console.log('Quote successfully added to database');
  } catch (error) {
    console.error('Error adding quote to database:', error);
    throw error;
  }
}

async function getQuotes() {
  try {
    console.log('Retrieving quotes from database');
    const [rows] = await pool.query(
      'SELECT id, text, author FROM quotes ORDER BY id DESC'
    );
    console.log(`Retrieved ${rows.length} quotes from database`);
    return rows;
  } catch (error) {
    console.error('Error retrieving quotes from database:', error);
    throw error;
  }
}

module.exports = {
  initializeDatabase,
  addQuote,
  getQuotes
}; 
