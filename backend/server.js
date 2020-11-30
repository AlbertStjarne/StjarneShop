import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

connectDB();

const app = express();

// morgan, only to run in dev
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// accept json data in the body
app.use(express.json());

// mounting, anything going to api/products goes to productRoutes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// making uploads folder static
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  // setting build folder to a static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // any route not being api (above) will point to below index.html
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  // if not in production
  app.get('/', (req, res) => {
    res.send('API is running');
  });
}

// middleware for routes not found (404)
app.use(notFound);

// error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
console.log('port..:', process.env.PORT);
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
