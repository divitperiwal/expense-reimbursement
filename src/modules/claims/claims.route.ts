import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { uploadBill } from "../../middlewares/upload.middleware.js";
import { roleMiddleware } from "@/middlewares/role.middleware.js";
import { Router } from "express";
import { handleApproveClaim, handleCreateClaim, handleDeleteClaim, handleDisburseClaim, handleGetAllClaims, handleGetClaim, handleGetSelfClaim, handleRejectClaim, handleSubmitClaim, handleUpdateClaim } from "./claims.controller.js";

const router = Router();

router.use(authMiddleware);


router.get('/me', roleMiddleware('employee'), handleGetSelfClaim);
router.post('/', roleMiddleware('employee'), uploadBill.single('bill'), handleCreateClaim);
router.patch('/:id', roleMiddleware('employee'), uploadBill.single('bill'), handleUpdateClaim);
router.patch('/:id/submit', roleMiddleware('employee'), handleSubmitClaim); 
router.delete('/:id', roleMiddleware('employee'), handleDeleteClaim);


//Admin, Manager and Finance
router.get('/', roleMiddleware('manager', 'finance', 'admin'), handleGetAllClaims);
router.get('/:id', roleMiddleware('manager', 'finance', 'admin'), handleGetClaim);
router.patch('/:id/approve', roleMiddleware('manager'), handleApproveClaim);
router.patch('/:id/disburse', roleMiddleware('finance'), handleDisburseClaim);
router.patch('/:id/reject', roleMiddleware('manager', 'finance'), handleRejectClaim);

export default router;
