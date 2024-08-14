// index.js

// Load environment variables from .env file
require('dotenv').config();

// Import modules
const express = require('express');
const connectDB = require('./Connect/database');
const cors = require('cors'); // Import CORS middleware

// Import routes
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./Routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// // Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Parse incoming JSON requests
app.use(express.json());

// Use routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  // console.error(err.stack); // Log error stack
  res.status(500).send('Something broke!'); // Send a generic error message
});

// Define PORT
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
