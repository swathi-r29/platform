const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/db');

// Load environment variables FIRST
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });
});

// Make io accessible to routes
app.set('io', io);

// CORS Middleware - BEFORE routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files Middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-session-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// API Routes - ALL TOGETHER HERE
console.log('📍 Loading API routes...');

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin-setup', require('./routes/adminCreationRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/worker', require('./routes/workerRoutes'));
app.use('/api/worker/earnings', require('./routes/workerEarningsRoutes')); // ✅ ADD HERE
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/availability', require('./routes/availabilityRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));

console.log('✅ All routes loaded successfully\n');

// Root Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Service Booking API Running',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
