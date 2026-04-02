import { Router } from "express";
import { handleRegister, handleLogin } from "./auth.controller.js";

const router = Router();

router.post('/login', handleLogin);
router.post('/register', handleRegister);

export default router;