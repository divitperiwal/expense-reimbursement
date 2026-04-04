import { sendSuccess } from "@/utils/constants/response.js"
import type { Request, Response } from "express"
import { ClaimsService } from "./claims.service.js"
import { createClaimSchema, getClaimSchema, rejectClaimSchema, submitClaimSchema, updateClaimSchema } from "@/types/validation/claim.validation.js"

export const handleGetSelfClaim = async (req: Request, res: Response) => {
    const { page, status } = getClaimSchema.parse(req.query);
    const claims = await ClaimsService.getSelfClaims(req.user.id, page, status);
    sendSuccess(res, 200, "Claims retrieved successfully", claims);

}
export const handleGetClaim = async (req: Request, res: Response) => {
    const claimId = req.params.id as string;
    const claim = await ClaimsService.getClaim(claimId, req.user.role);
    sendSuccess(res, 200, "Claim retrieved successfully", claim);
}
export const handleCreateClaim = async (req: Request, res: Response) => {
    const { amount, category, date, notes } = createClaimSchema.parse(req.body);
    const claimId = await ClaimsService.createClaim(req.user.id, amount, category, date, notes, req.file);
    sendSuccess(res, 201, "Claim created successfully", claimId);
}
export const handleUpdateClaim = async (req: Request, res: Response) => {
    const { amount, category, date, notes } = updateClaimSchema.parse(req.body);
    const claimId = req.params.id as string;
    const updatedClaim = await ClaimsService.updateClaim(req.user.id, claimId, amount, category, date, notes, req.file);
    sendSuccess(res, 200, "Claim updated successfully", updatedClaim);

}
export const handleSubmitClaim = async (req: Request, res: Response) => {
    const claimId = req.params.id as string;
    const { notes } = submitClaimSchema.parse(req.body);
    const submittedClaim = await ClaimsService.submitClaim(req.user.id, claimId, notes);
    sendSuccess(res, 200, "Claim submitted successfully", submittedClaim);
}
export const handleApproveClaim = async (req: Request, res: Response) => {
    const claimId = req.params.id as string;
    const approvedClaim = await ClaimsService.approveClaim(req.user.id, claimId);
    sendSuccess(res, 200, "Claim approved successfully", approvedClaim);
}
export const handleDisburseClaim = async (req: Request, res: Response) => {
    const claimId = req.params.id as string;
    const disbursedClaim = await ClaimsService.disburseClaim(req.user.id, claimId);
    sendSuccess(res, 200, "Claim disbursed successfully", disbursedClaim);
}
export const handleRejectClaim = async (req: Request, res: Response) => {
    const claimId = req.params.id as string;
    const { notes } = rejectClaimSchema.parse(req.body);
    const rejectedClaim = await ClaimsService.rejectClaim(req.user.id, req.user.role, claimId, notes);
    sendSuccess(res, 200, "Claim rejected successfully", rejectedClaim);
}
export const handleDeleteClaim = async (req: Request, res: Response) => {
    const claimId = req.params.id as string;
    await ClaimsService.deleteClaim(req.user.id, claimId);
    sendSuccess(res, 200, "Claim deleted successfully");
}

export const handleGetAllClaims = async (req: Request, res: Response) => {
    const { page, status } = getClaimSchema.parse(req.query);
    const claims = await ClaimsService.getAllClaims(page, status, req.user.role)
    sendSuccess(res, 200, "Claims retrieved successfully", claims)
}