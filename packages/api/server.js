require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const { prisma } = require('database');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO untuk Realtime
const io = new Server(server, {
  cors: {
    origin: '*', // Di production, ganti dengan URL frontend yang spesifik
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Menyimpan instance io ke app agar bisa dipakai di controller
app.set('io', io);

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Join room berdasarkan kopdesId untuk notifikasi spesifik Kopdes
  socket.on('join_kopdes', (kopdesId) => {
    socket.join(`kopdes_${kopdesId}`);
    console.log(`Socket ${socket.id} joined room kopdes_${kopdesId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Basic route test
app.get('/api/health', async (req, res) => {
  try {
    // Test DB connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', message: 'API is running and DB is connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed', error: error.message });
  }
});

// Menjalankan server
const PORT = process.env.API_PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Shared API Server running on port ${PORT}`);
});
