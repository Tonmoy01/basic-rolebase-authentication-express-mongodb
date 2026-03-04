import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken } from '../utils/token.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookies.js';

const hashToken = (t) => crypto.createHash('sha256').update(t).digest('hex');

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

  const accessToken = signAccessToken({ id: user._id });
  const refreshToken = signRefreshToken({ id: user._id });

  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  setAuthCookies(res, { accessToken, refreshToken });

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

  const accessToken = signAccessToken({ id: user._id });
  const refreshToken = signRefreshToken({ id: user._id });
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  setAuthCookies(res, { accessToken, refreshToken });

  res.json({
    message: 'Logged in successfully!',
    user: { id: user._id, name: user.name, email: user.email },
  });
};

// Refresh access token
export const refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    if (!user.refreshTokenHash || user.refreshTokenHash !== hashToken(token)) {
      clearAuthCookies(res);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const newAccessToken = signAccessToken({ id: user._id });
    const newRefreshToken = signRefreshToken({ id: user._id });

    user.refreshTokenHash = hashToken(newRefreshToken);
    await user.save();

    setAuthCookies(res, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Logout user
export const logout = async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      await User.findByIdAndUpdate(decoded.id, { refreshTokenHash: null });
    } catch {}
  }

  res.json({ message: 'Logged out successfully!' });
};
