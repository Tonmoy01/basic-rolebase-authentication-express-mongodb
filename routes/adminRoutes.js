import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});

export default router;
