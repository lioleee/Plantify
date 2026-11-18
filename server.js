require('dotenv').config();
const express = require('express');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const verifyToken = require('./middleware/authMiddleware');
const plantRoutes = require('./routes/plantRoutes');


const app = express();

app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);

// Home route
app.get('/', (req, res) => {
    res.send('Plantify Backend is Running!');
});

// Database test route
app.get('/test-db', async (req, res) => {
    try {
        const [result] = await db.query('SELECT 1 AS test');

        res.json({
            success: true,
            message: 'MySQL connected successfully!',
            result
        });
    } catch (error) {
        console.error('Database error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Database connection failed'
        });
    }
});
// Protected route test
app.get('/api/protected', verifyToken, (req, res) => {
    res.json({
        success: true,
        message: 'You are authenticated!',
        user: req.user
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Plantify server running on port ${PORT}`);
});
