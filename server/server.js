const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const expressSanitizer = require('express-sanitizer');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const hackathonRoutes = require('./routes/hackathonRoutes');
const projectRoutes = require('./routes/projectRoutes');
const teamRoutes = require('./routes/teamRoutes');

const app = express();

// Security Middleware
app.use(helmet()); // Security headers

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Stricter CORS configuration
app.use(cors({ 
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600 // Preflight results cache for 10 minutes
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(expressSanitizer());

// Prevent parameter pollution
app.use(hpp());

// Request Parsing & Logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);

// Import error handling middleware
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// 404 Handler - This should come after your routes
app.use(notFound);

// Centralized Error Handler Middleware - This should be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
let server;

// MongoDB Connection with Retry Logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('✅ MongoDB connected successfully');
            return true;
        } catch (err) {
            if (i === retries - 1) {
                console.error('❌ MongoDB connection failed after all retries:', err);
                process.exit(1);
            }
            console.log(`MongoDB connection attempt ${i + 1} failed. Retrying in ${delay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};


const gracefulShutdown = async () => {
    console.log('🔄 Initiating graceful shutdown...');
    
    if (server) {
        await new Promise((resolve) => {
            server.close(resolve);
        });
        console.log('👋 HTTP server closed');
    }
    
    try {
        await mongoose.connection.close();
        console.log('📋 MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during shutdown:', err);
        process.exit(1);
    }
};

// Start Server
const startServer = async () => {
    try {
        mongoose.set('strictQuery', true);
        await connectWithRetry();
        
        server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

        // Handle process events for graceful shutdown
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);
        process.on('unhandledRejection', (err) => {
            console.error('❌ Unhandled Promise Rejection:', err);
            gracefulShutdown();
        });

    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
};

startServer();