import dns from 'node:dns';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);
import connectDB from './config/db';

dotenv.config();
await connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('API is running... ✅'));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
