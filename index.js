import dns from 'node:dns';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import { protect } from './middleware/auth.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);
import connectDB from './config/db';

dotenv.config();
await connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('API is running... ✅'));

app.use('/api/auth', authRoutes);

// test protected route
app.get('/api/me', protect, (req, res) => {
  res.json({ user: req.user });
});

const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
