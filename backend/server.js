const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend-backend communication
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true
}));

app.use(express.json());

// Initialize database with delay to ensure MySQL is ready
setTimeout(() => {
  db.initializeDatabase();
}, 5000); // Wait 5 seconds before initializing database

// API Routes
app.get('/api/quotes', async (req, res) => {
  try {
    console.log('GET /api/quotes - Fetching quotes from database');
    const quotes = await db.getQuotes();
    
    console.log(`GET /api/quotes - Found ${quotes.length} quotes`);
    res.json(quotes);
  } catch (error) {
    console.error('GET /api/quotes - Error fetching quotes:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

app.post('/api/quotes', async (req, res) => {
  const { text, author } = req.body;
  
  console.log('POST /api/quotes - Received quote submission:', { text, author });
  
  // Validate input
  if (!text || !author) {
    console.log('POST /api/quotes - Validation failed: text or author missing');
    return res.status(400).json({ error: 'Text and author are required' });
  }

  // Check word count
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount > 50) {
    console.log('POST /api/quotes - Validation failed: word count exceeded');
    return res.status(400).json({ error: 'Quote cannot exceed 50 words' });
  }

  try {
    console.log('POST /api/quotes - About to call db.addQuote()');
    await db.addQuote(text, author);
    console.log('POST /api/quotes - db.addQuote() completed successfully');
    
    console.log('POST /api/quotes - About to call db.getQuotes()');
    const quotes = await db.getQuotes();
    console.log('POST /api/quotes - db.getQuotes() returned:', quotes.length, 'quotes');
    console.log('POST /api/quotes - First quote from DB:', quotes[0]);
    
    res.status(201).json(quotes);
  } catch (error) {
    console.error('POST /api/quotes - Error saving quote:', error);
    res.status(500).json({ error: 'Failed to add quote: ' + error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 
