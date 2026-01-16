const express = require('express');
const cors = require('cors'); // <-- dodano
const app = express();

// Middleware za CORS (dovolimo Angular na localhost:4200)
app.use(cors({
    origin: 'http://localhost:4200', // Angular URL
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));

// Middleware za JSON
app.use(express.json());

// Povezovanje usmerjevalnika
const indexApi = require('./app-api/routes/index');

// Test endpoint
app.get('/', (req, res) => {
    res.send('Recipe API running');
});

// Uporaba usmerjevalnika
app.use('/api', indexApi);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
