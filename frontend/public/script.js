//console.log('JavaScript file loaded successfully!'); #uncomment front end debuging
//alert('Script is working!'); #uncomment for front end debuging

// Frontend JavaScript with proper error handling
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const wordCount = document.getElementById('wordCount');
    const saveButton = document.getElementById('saveQuote');
    const displayQuote = document.getElementById('displayQuote');
    const displayAuthor = document.getElementById('displayAuthor');
    const historyButton = document.getElementById('historyButton');
    const historyPanel = document.getElementById('historyPanel');
    const closeHistory = document.getElementById('closeHistory');
    const historyList = document.getElementById('historyList');
    const notification = document.getElementById('notification');
    
    // Try different API URLs for Docker and local development
    const API_URLS = [
        'http://localhost:3001',
        'http://backend:3001',
        'http://127.0.0.1:3001'
    ];
    
    let API_BASE_URL = 'http://localhost:3001'; // Default
    
    // Load initial quote and history
    loadQuotes();
    
    // Word count functionality
    quoteText.addEventListener('input', updateWordCount);
    
    function updateWordCount() {
        const text = quoteText.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        wordCount.textContent = `Words: ${words}/50`;
        
        if (words > 50) {
            wordCount.classList.add('limit-exceeded');
        } else {
            wordCount.classList.remove('limit-exceeded');
        }
    }
    
    // Save quote functionality
    saveButton.addEventListener('click', async function() {
        const text = quoteText.value.trim();
        const author = quoteAuthor.value.trim();
        
        console.log('Save button clicked'); // Debug log
        console.log('Form data:', { text, author }); // Debug log
        
        if (!text || !author) {
            showNotification('Please enter both quote and author', true);
            return;
        }
        
        const wordCount = text.split(/\s+/).length;
        if (wordCount > 50) {
            showNotification('Quote cannot exceed 50 words', true);
            return;
        }
        
        try {
            console.log('About to send API request...'); // Debug log
            console.log('Using API URL:', API_BASE_URL); // Debug log
            
            const response = await fetch(`${API_BASE_URL}/api/quotes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, author }),
            });
            
            console.log('API response received'); // Debug log
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API error response:', errorText);
                throw new Error(errorText || 'Failed to save quote');
            }
            
            const quotes = await response.json();
            console.log('Saved successfully, received quotes:', quotes);
            
            updateDisplay(quotes[0]);
            updateHistoryPanel(quotes);
            
            // Clear the form
            quoteText.value = '';
            quoteAuthor.value = '';
            updateWordCount();
            
            // Show success notification
            showNotification('Quote saved successfully!');
        } catch (error) {
            console.error('Error saving quote:', error);
            console.error('Full error details:', error.message, error.stack);
            showNotification(error.message || 'Failed to save quote', true);
        }
    });
    
    // Load quotes from backend with API URL discovery
    async function loadQuotes() {
        for (const url of API_URLS) {
            try {
                console.log('Trying to load quotes from:', url);
                const response = await fetch(`${url}/api/quotes`);
                console.log('Response status for', url, ':', response.status);
                
                if (response.ok) {
                    API_BASE_URL = url; // Remember working URL
                    console.log('Successfully connected to API at:', API_BASE_URL);
                    
                    const quotes = await response.json();
                    console.log('Loaded quotes:', quotes);
                    
                    if (quotes.length > 0) {
                        updateDisplay(quotes[0]);
                        updateHistoryPanel(quotes);
                    }
                    return; // Success, exit the loop
                }
            } catch (error) {
                console.log('Failed to connect to:', url, error.message);
                continue; // Try next URL
            }
        }
        
        console.error('Failed to connect to any API URL');
        showNotification('Failed to connect to server', true);
    }
    
    // Update display with a quote
    function updateDisplay(quote) {
        displayQuote.textContent = quote.text;
        displayAuthor.textContent = quote.author;
    }
    
    // Update history panel
    function updateHistoryPanel(quotes) {
        historyList.innerHTML = '';
        
        if (quotes.length === 0) {
            historyList.innerHTML = '<p>No quotes saved yet</p>';
            return;
        }
        
        quotes.forEach((quote) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <p><strong>${quote.text}</strong></p>
                <p><em>${quote.author}</em></p>
            `;
            
            historyItem.addEventListener('click', () => {
                updateDisplay(quote);
                historyPanel.classList.remove('active');
            });
            
            historyList.appendChild(historyItem);
        });
    }
    
    // History panel functionality
    historyButton.addEventListener('click', function() {
        historyPanel.classList.add('active');
    });
    
    closeHistory.addEventListener('click', function() {
        historyPanel.classList.remove('active');
    });
    
    // Notification functionality
    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.classList.remove('error');
        notification.classList.remove('show');
        
        if (isError) {
            notification.classList.add('error');
        }
        
        notification.classList.add('show');
        
        setTimeout(function() {
            notification.classList.remove('show');
        }, 3000);
    }
}); 
