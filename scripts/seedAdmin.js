import dns from 'node:dns';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import connectDB from '../config/db.js';
import User from '../models/User.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = 'admin@example.com';
    const password = 'admin123';

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('Admin user already exists. Skipping seeding.');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: 'Admin',
      email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin created successfully! ✅');
    console.log({
      email: admin.email,
      password,
    });

    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
