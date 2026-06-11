import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';

import userRoutes from './routes/userRoutes';
import accountRoutes from './routes/accountRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// Security middleware
app.use(helmet());

// CORS configuration

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [`${process.env.KP_SITE}`] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/accounts`, accountRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Node.js API Scaffold',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: `${API_PREFIX}/users`,
      docs: 'API documentation not implemented yet',
    },
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection and server startup
async function startServer() {
  try {
    // Initialize database connection
    //await AppDataSource.initialize();
    // console.log('✅ Database connection established');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📖 API endpoints available at http://localhost:${PORT}${API_PREFIX}`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('\n📚 Available endpoints:');
        console.log(`   GET    ${API_PREFIX}/users - Get all users`);
        console.log(`   GET    ${API_PREFIX}/users/:id - Get user by ID`);
        console.log(`   POST   ${API_PREFIX}/users - Create new user`);
        console.log(`   PUT    ${API_PREFIX}/users/:id - Update user`);
        console.log(`   DELETE ${API_PREFIX}/users/:id - Delete user`);
        console.log(`   GET    ${API_PREFIX}/users/:id/posts - Get user's posts`);
      }
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();

export default app;