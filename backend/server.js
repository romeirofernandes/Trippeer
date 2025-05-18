const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const travelRoutes = require('./routes/travelRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Routes
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');

app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/travel', travelRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});