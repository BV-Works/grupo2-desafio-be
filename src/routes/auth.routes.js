import express from 'express';
import { login, getMe, logout } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { loginLimiter } from '../middlewares/rateLimit.middleware.js';
const router = express.Router();

// POST /api/auth/login
router.post('/login', loginLimiter, login);
// GET /api/auth/me
router.get('/me', authMiddleware, getMe);
// POST /api/auth/logout
router.post('/logout', logout);

export default router;
