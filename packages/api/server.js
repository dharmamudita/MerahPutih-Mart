require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const posRoutes = require('./routes/pos.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const addressRoutes = require('./routes/address.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const reviewRoutes = require('./routes/review.routes');
const notificationRoutes = require('./routes/notification.routes');
const memberRoutes = require('./routes/member.routes');
const supplierRoutes = require('./routes/supplier.routes');
const financeRoutes = require('./routes/finance.routes');
const reportRoutes = require('./routes/report.routes');
<<<<<<< HEAD
=======
const superAdminRoutes = require('./routes/superadmin.routes');
>>>>>>> 18373dc (code review)

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Di production harus disesuaikan
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/reports', reportRoutes);
<<<<<<< HEAD
=======
app.use('/api/superadmin', superAdminRoutes);
>>>>>>> 18373dc (code review)

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to KopDes Merah Putih Shared API' });
});

// Menyimpan instance io ke app agar bisa dipakai di controller
app.set('io', io);

// Socket.IO Connection Event
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.API_PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});
