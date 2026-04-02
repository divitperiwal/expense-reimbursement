import { asyncHandler } from "@/utils/constants/async-handler.js"
import { sendSuccess } from "@/utils/constants/response.js"
import { AuthService } from "./auth.service.js"
import { loginSchema, registerSchema } from "@/types/validation/auth.validation.js"

export const handleRegister = asyncHandler(async (req, res) => {
    const { name, email, password } = registerSchema.parse(req.body);
    const tokens = await AuthService.register(name, email, password);
    sendSuccess(res, 201, "User registered successfully", tokens)
})
export const handleLogin = asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const tokens = await AuthService.login(email, password);
    sendSuccess(res, 200, "User logged in successfully", tokens)
})
