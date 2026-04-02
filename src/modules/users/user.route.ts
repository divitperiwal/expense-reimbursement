import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { roleMiddleware } from "@/middlewares/role.middleware.js";
import { Router } from "express";
import { handleGetAllUsers, handleGetSelf, handleGetUser, handleUpdateRole, handleUpdateStatus } from "./user.controller.js";

const router = Router();

router.use(authMiddleware);

//Can be access by the user himself
router.get('/me', handleGetSelf)

//Can be accessed by admin only
router.use(roleMiddleware('admin'));
router.get('/', handleGetAllUsers);
router.get('/:id', handleGetUser);
router.patch('/:id/role', handleUpdateRole);
router.patch('/:id/status', handleUpdateStatus);
export default router;