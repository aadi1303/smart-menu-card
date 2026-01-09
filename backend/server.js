require('dotenv').config();
const express = require('express');

const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const config = require('./config/config');
const menuItemRoutes = require('./routes/menuItems');
const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files - Add this line to serve images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Routes
app.use('/api/menu-item', menuItemRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const serverless = require('serverless-http');

module.exports = serverless(app);
