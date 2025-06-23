import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import logger from './utils/logger';
import { dev, port } from './utils/helpers';
import { OK, INTERNAL_SERVER_ERROR } from './utils/http-status';
import { AppError } from './utils/error';
import { connectDB } from './config/database';
import { authorized } from './middleware/auth.middleware';

// Load env variables
dotenv.config();

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(morgan('tiny', {
  stream: {
    write: (msg) => logger.info(msg.trim()),
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// basic routes
app.get('/', (req: Request, res: Response) => {
  res.status(OK).json({ message: 'Weather API - Welcome!' });
});

(async () => {
  try {
    await connectDB();
// routers
    const usersRoutes = (await import('./routes/users.routes')).default;
    const weatherRoutes = (await import('./routes/weather.routes')).default;
    const historyRoutes = (await import('./routes/history.routes')).default;

    app.use('/auth', usersRoutes);
    app.use('/weather', authorized, weatherRoutes);
    app.use('/history', authorized, historyRoutes);
 const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => logger.info(`Server is connected on port ${PORT}`));
  } catch (error) {
    logger.error('Failed to connect with MongoDB:', error);
    process.exit(1);
  }
})();

// Error handling middleware
app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Error:', err.message);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(dev && { stack: err.stack }),
    });
    return;
  }

  res.status(INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Something went wrong!',
    ...(dev && { error: err.message, stack: err.stack }),
  });
});
