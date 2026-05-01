const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const socketService = require('./services/socketService');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Initialize Socket Service
socketService.init(io);

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Apply Routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', reservationRoutes);
app.use('/api', adminRoutes);

// API Discovery Route for Documentation
app.get('/api', (req, res) => {
  res.json({
    message: "Welcome to Shelf Scout API",
    version: "1.0.0",
    endpoints: {
      auth: [
        { method: "POST", path: "/api/auth/signup", description: "Register a new user or dealer" },
        { method: "POST", path: "/api/auth/login", description: "Authenticate and get JWT token" }
      ],
      products: [
        { method: "GET", path: "/api/products", description: "Get all products" },
        { method: "GET", path: "/api/stores", description: "Get all stores" },
        { method: "GET", path: "/api/inventory", description: "Get live inventory status" },
        { method: "POST", path: "/api/admin/inventory/update", description: "Update product stock (Admin)" }
      ],
      reservations: [
        { method: "GET", path: "/api/reservations", description: "Get all reservations" },
        { method: "POST", path: "/api/reserve", description: "Create a temporary reservation" },
        { method: "POST", path: "/api/reservations/:id/confirm", description: "Confirm a reservation (Admin)" },
        { method: "DELETE", path: "/api/reservations/:id", description: "Cancel a reservation" }
      ],
      admin: [
        { method: "GET", path: "/api/admin/analytics", description: "Get business analytics and demand data" }
      ]
    }
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

module.exports = app;
