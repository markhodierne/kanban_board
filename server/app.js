const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const CLIENT_DIR = path.join(__dirname, '../client');

// Middleware
app.use(cors());
app.use(express.json());

// Static file serving from client directory
app.use(express.static(CLIENT_DIR));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Kanban board server is running' });
});

// API routes will be added here in future tickets
// app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);
  console.error('Stack trace:', err.stack);
  
  // Send appropriate error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Handle 404 for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Serve index.html for all other routes (SPA fallback)
app.get('/', (req, res) => {
  res.sendFile(path.join(CLIENT_DIR, 'index.html'));
});

// Start server
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Kanban board server running on port ${PORT}`);
      console.log(`Serving static files from: ${CLIENT_DIR}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;