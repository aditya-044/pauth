import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dns from "dns";
import helmet from "helmet";

import { connectDB }  from './src/db/index.js';

import { authRouter } from './src/routes/auth.js';
import { accountRouter } from './src/routes/accounts.js';
import { backupRouter } from './src/routes/backup.js';
import { getEnv } from './src/config/config.js';
import { logError } from './src/utils/error.js';


dns.setServers(["8.8.8.8", "8.8.4.4"])

const app = express();
app.use(helmet());

const corsOptions = {
  origin: [getEnv("FRONTEND_URL")],
  allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions));

app.use(express.json({limit: "1mb"}));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

const limiter = rateLimit({
  windowMs: parseInt(getEnv("RATE_LIMIT_WINDOW_MS")) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(getEnv("RATE_LIMIT_MAX_REQUESTS")) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/backup', backupRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: getEnv("NODE_ENV") === 'development' ? err.message : undefined
  });
});

const PORT = getEnv("PORT") || 5001;
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${getEnv("NODE_ENV") || 'development'}`);
    });
  } catch (err) {
    logError("Failed to start server: ", err);
    process.exit(1);
  }
}

startServer();