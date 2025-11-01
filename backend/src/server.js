import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import os from 'os';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import chatbotRoutes from './routes/chatbot.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chatbots', chatbotRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Get local IP address
const getLocalIP = () => {
  // Allow manual override via environment variable
  if (process.env.LOCAL_IP) {
    return process.env.LOCAL_IP;
  }
  
  const interfaces = os.networkInterfaces();
  // Try to find 192.168.0.x first (common local network)
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal && iface.address.startsWith('192.168.0.')) {
        return iface.address;
      }
    }
  }
  // Fallback to any non-internal IPv4
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces
const LOCAL_IP = getLocalIP();

connectDB().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    if (LOCAL_IP !== 'localhost') {
      console.log(`🌐 Accessible on your network at http://${LOCAL_IP}:${PORT}`);
    }
  });
});


