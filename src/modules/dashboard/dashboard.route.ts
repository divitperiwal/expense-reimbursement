import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware.js';
import {
    handleGetSummary,
    handleGetCategories,
    handleGetTrends,
    handleGetPending,
} from './dashboard.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/summary', handleGetSummary);
router.get('/categories', handleGetCategories);
router.get('/trends', handleGetTrends);
router.get('/pending', handleGetPending);

export default router;