import { Router } from "express";
import { handleRegister, handleLogin, handleLogout } from "./auth.controller.js";
import { authRateLimiter } from "../../middlewares/rate-limit.middleware.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";

const router = Router();

router.use(authRateLimiter);
router.post('/login', handleLogin);
router.post('/register', handleRegister);
router.post('/logout', authMiddleware, handleLogout);

export default router;