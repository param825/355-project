const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files

// Database setup
const db = new sqlite3.Database('./contact.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the contact database.');
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT
    )`);
});

// Routes
app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;
    db.run(`INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)`, [name, email, message], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to save message.' });
        }
        res.status(200).json({ success: 'Message sent successfully!' });
    });
});

app.post('/clear-database', (req, res) => {
    db.run(`DELETE FROM contacts`, function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to clear database.' });
        }
        res.status(200).json({ success: 'Database cleared successfully!' });
    });
});

app.get('/view-messages', (req, res) => {
    db.all("SELECT * FROM contacts", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(`<html><body><h1>Messages</h1>${rows.map(row => `<p><strong>Name:</strong> ${row.name}<br><strong>Email:</strong> ${row.email}<br><strong>Message:</strong> ${row.message}</p>`).join('')}</body></html>`);
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
