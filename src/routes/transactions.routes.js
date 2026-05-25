import { Router } from 'express';
import { getTransactions, getTransactionByIdController, updateTransactionByIdController } from '../controllers/transactions.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, getTransactions);
router.get('/:id', authMiddleware, getTransactionByIdController);
router.put('/:id', authMiddleware, updateTransactionByIdController);

export default router;