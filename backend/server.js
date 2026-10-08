const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./db');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/ai', require('./routes/proxy'));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'TripGenie Backend' }));

app.use((req, res) => res.status(404).json({ message: `Not found: ${req.method} ${req.url}` }));

const server = app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));

connectDB().catch(err => console.error('❌ PostgreSQL connection failed:', err.message));