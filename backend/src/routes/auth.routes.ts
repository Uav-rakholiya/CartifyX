import express from 'express';
import { register, login, getProfile, firebaseSocialLogin, forgotPassword, resetPassword, forgotPasswordMobile, verifyOtp } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerValidator, loginValidator } from '../validators/user.validator';
import { authLimiter } from '../middleware/rate-limiter.middleware';

const router = express.Router();

router.post('/register', authLimiter, validate(registerValidator), register);
router.post('/login', authLimiter, validate(loginValidator), login);
router.post('/google', firebaseSocialLogin);
router.post('/facebook', firebaseSocialLogin);
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password', authLimiter, resetPassword);
router.post('/forgot-password-mobile', authLimiter, forgotPasswordMobile);
router.post('/verify-otp', verifyOtp);
// router.get('/profile', authMiddleware, getProfile);

export default router;
