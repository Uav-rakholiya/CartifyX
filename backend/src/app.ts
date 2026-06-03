import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { errorHandler } from './middleware/error.middleware';
import { swaggerOptions } from './config/swagger.config';

// Import routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import categoryRoutes from './routes/category.routes';
import orderRoutes from './routes/order.routes';
import userRoutes from './routes/user.routes';
import contactRoutes from './routes/contact.routes';
import wishlistRoutes from './routes/wishlist.routes';
import paymentRoutes from './routes/payment.routes';
import invoiceRoutes from './routes/invoice.routes';

const app = express();

// Trust proxy for rate limiter to get correct IP
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || "https://cartifyx-e0boakaqkq-evolvyn.vercel.app",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'CartifyX API'
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/invoices', invoiceRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

export default app;