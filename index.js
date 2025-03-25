import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';

import tripRoutes from './routes/trip.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1', authRoutes);
app.use('/api/v1', tripRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(3000);

export default app;
