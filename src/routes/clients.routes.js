import { Router } from 'express';
import { getClients } from '../controllers/clients.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, getClients);

export default router;
