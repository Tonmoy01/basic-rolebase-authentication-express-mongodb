import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendEmail } from '../utils/mailer.js';

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Please provide email' });

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(404)
      .json({ message: 'If that email exists, a reset link has been sent.' });

  const resetToken = crypto.randomBytes(20).toString('hex');

  const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashed;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins

  await user.save();

  const resetUrl = `${process.env.APP_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Click to Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
    `,
  });

  res.json({ message: 'Password reset link has been sent.' });
};

// reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  user.password = await bcrypt.hash(password, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.json({ message: 'Password reset successful!' });
};
