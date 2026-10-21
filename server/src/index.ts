import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { apiRouter } from './routes/api.js';
import { seedDemoWorkspace } from './data/seedData.js';
import { Shipment } from './models/index.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flowtwin';

// Socket.IO configuration
export const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

io.on('connection', socket => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    product: 'FlowTwin AI',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[FlowTwin API Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});

// MongoDB Connection & Server Launch
async function startServer() {
  try {
    console.log(`[FlowTwin AI] Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('[FlowTwin AI] MongoDB connection established successfully.');

    // Auto-seed demo dataset if database is empty
    const shipmentCount = await Shipment.countDocuments();
    if (shipmentCount === 0) {
      console.log('[FlowTwin AI] Empty database detected. Auto-seeding enterprise logistics dataset...');
      await seedDemoWorkspace(true);
    } else {
      console.log(`[FlowTwin AI] Database active with ${shipmentCount} existing shipments.`);
    }

    server.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  FlowTwin AI Control Tower Server Running on Port ${PORT}`);
      console.log(`  API Base URL: http://localhost:${PORT}/api`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (err: any) {
    console.error('[FlowTwin AI] Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
