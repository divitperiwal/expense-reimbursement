import type { Request, Response } from 'express';
import { sendSuccess } from '@/utils/constants/response.js';
import { DashboardService } from './dashboard.service.js';

export const handleGetSummary = async (req: Request, res: Response) => {
    const summary = await DashboardService.getSummary(req.user.id, req.user.role);
    sendSuccess(res, 200, 'Summary retrieved successfully', summary);
};

export const handleGetCategories = async (req: Request, res: Response) => {
    const categories = await DashboardService.getCategories(req.user.id, req.user.role);
    sendSuccess(res, 200, 'Categories retrieved successfully', categories);
};

export const handleGetTrends = async (req: Request, res: Response) => {
    const trends = await DashboardService.getTrends(req.user.id, req.user.role);
    sendSuccess(res, 200, 'Trends retrieved successfully', trends);
};

export const handleGetPending = async (req: Request, res: Response) => {
    const { page } = req.query;
    const pending = await DashboardService.getPending(req.user.id, req.user.role, page ? parseInt(page as string) : undefined);
    sendSuccess(res, 200, 'Pending claims retrieved successfully', pending);
};