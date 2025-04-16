// src/server.js
import app from './app.js';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add this to catch unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});