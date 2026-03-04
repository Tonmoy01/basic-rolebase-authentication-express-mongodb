import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';
import { setAuthCookie } from '../utils/cookies.js';

// Register a new user
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashed });

  const token = signToken({ id: user._id });

  setAuthCookie(res, token);

  res.status(201).json({
    message: 'User registered successfully!',
    user: { id: user._id, name: user.name, email: user.email },
  });
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });

  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ id: user._id });

  setAuthCookie(res, token);

  res.json({
    message: 'Logged in successfully!',
    user: { id: user._id, name: user.name, email: user.email },
  });
};

// Logout user
export const logout = (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';

  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });

  res.json({ message: 'Logged out successfully!' });
};
