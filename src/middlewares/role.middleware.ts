import type { Role } from '@/types/common.js';
import { ApiError } from '@/utils/constants/api-error.js';
import type { NextFunction, Request, Response } from 'express';

export const roleMiddleware = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) throw new ApiError('Unauthorized', 401)
        if (!roles.includes(req.user.role)) throw new ApiError('Forbidden', 403)
        next();
    }
}