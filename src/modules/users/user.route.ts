import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { roleMiddleware } from "@/middlewares/role.middleware.js";
import { Router } from "express";
import { handleGetAllUsers, handleGetUser, handleUpdateRole, handleUpdateStatus } from "./user.controller.js";

const router = Router();

router.use(authMiddleware);

//Can be access by the user himself
router.get('/:id', handleGetUser);

//Can be accessed by admin only
router.get('/', roleMiddleware('admin'), handleGetAllUsers);
router.patch('/:id/role', roleMiddleware('admin'), handleUpdateRole);
router.patch('/:id/status', roleMiddleware('admin'), handleUpdateStatus);
export default router;