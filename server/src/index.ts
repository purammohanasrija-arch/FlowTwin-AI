import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api.js';
import { seedDemoWorkspace } from './data/seedData.js';
import { Shipment } from './models/index.js';
import { initSqliteDatabase } from './db/sqlite.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

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
    database: 'sqlite (file-persisted: data/flowtwin.sqlite)',
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

// SQLite File Database Initialization & Server Launch
async function startServer() {
  try {
    console.log('[FlowTwin AI] Initializing SQLite file-based database...');
    await initSqliteDatabase();
    console.log('[FlowTwin AI] SQLite database initialized and ready.');

    // Auto-seed demo dataset if database is empty
    const shipmentCount = await Shipment.countDocuments();
    if (shipmentCount === 0) {
      console.log('[FlowTwin AI] Empty database detected. Auto-seeding enterprise logistics dataset into SQLite...');
      await seedDemoWorkspace(true);
      const seededCount = await Shipment.countDocuments();
      console.log(`[FlowTwin AI] SQLite successfully populated with ${seededCount} shipments and network infrastructure.`);
    } else {
      console.log(`[FlowTwin AI] SQLite active with ${shipmentCount} existing shipments.`);
    }
  } catch (err: any) {
    console.error('[FlowTwin AI] SQLite initialization error:', err.message);
  }

  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`  FlowTwin AI Control Tower Server Running on Port ${PORT}`);
    console.log(`  Database Engine: SQLite (Local & Render Persistent File)`);
    console.log(`  API Base URL: http://0.0.0.0:${PORT}/api`);
    console.log(`  Health Check: http://0.0.0.0:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

startServer();
