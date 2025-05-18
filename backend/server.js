const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const uri = process.env.ATLAS_URI || "mongodb://localhost:27017/myapp";
mongoose.connect(uri);
const connection = mongoose.connection;
if(connection) {
  console.log("MongoDB connection string: ", uri);
}

// Routes
app.get('/', (req, res) => {
  res.send('API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});