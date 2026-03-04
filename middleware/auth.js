import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  // const auth = req.headers.authorization || '';
  // const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user)
      return res
        .status(401)
        .json({ message: 'Not Authorized (User not found!)' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
