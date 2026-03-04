import { Router } from 'express';
import { register, login, logout } from '../controllers/authController.js';
import {
  forgotPassword,
  resetPassword,
} from '../controllers/passwordController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
