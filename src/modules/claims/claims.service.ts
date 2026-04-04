import type { ClaimStatus } from "@/types/common.js";
import { ClaimsDatabase } from "./claims.database.js";
import { ApiError } from "@/utils/constants/api-error.js";
import { expenseClaims } from "@/database/schema/expense-claims.schema.js";
import { roleVisibleStatuses, type Role} from "@/types/common.js";
import { deleteClaimImageFromCloudinary, uploadClaimImageToCloudinary } from "../../lib/cloudinary-upload.js";

export const ClaimsService = {
    createClaim: async (userId: string, amount: number, category: string, date: Date, notes?: string, billFile?: Express.Multer.File) => {
        if (!userId) throw new ApiError('User ID is required', 400);
        if (!amount || amount <= 0) throw new ApiError('Amount must be greater than 0', 400);
        if (!category) throw new ApiError('Category is required', 400);
        if (!date) throw new ApiError('Date is required', 400);
        if (date >= new Date()) throw new ApiError('Date cannot be in future', 400);

        const billUrl = billFile ? await uploadClaimImageToCloudinary(billFile, userId) : undefined;

        const claimId = await ClaimsDatabase.createClaim(userId, amount, category, date, notes, billUrl);
        if (!claimId) throw new ApiError('Failed to create claim', 500);
        await ClaimsDatabase.createClaimAction(claimId.id, userId, 'created');
        return claimId;

    },
    getAllClaims: async (page: number | undefined, status: ClaimStatus | undefined, role: Role) => {
        if (!page || page < 1) page = 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const allowedStatuses = roleVisibleStatuses[role];

        if (status && !allowedStatuses.includes(status)) {
            throw new ApiError('No claims found', 404);
        }

        const { claims, total } = status
            ? await ClaimsDatabase.getAllClaimsByStatus(offset, limit, status)
            : role === 'admin'
                ? await ClaimsDatabase.getAllClaims(offset, limit)
                : await ClaimsDatabase.getAllClaimsByStatuses(offset, limit, allowedStatuses);
        if (claims.length === 0) throw new ApiError('No claims found', 404);
        return { claims, meta: { currentPage: page, totalPages: Math.ceil(total / limit) } };

    },
    getSelfClaims: async (userId: string, page: number | undefined, status: ClaimStatus | undefined) => {
        if (!userId) throw new ApiError('User ID is required', 400);
        if (!page || page < 1) page = 1;

        const limit = 10;
        const offset = (page - 1) * limit;

        const { claims, total } = status
            ? await ClaimsDatabase.getClaimsByEmployeeAndStatus(userId, offset, limit, status)
            : await ClaimsDatabase.getClaimsByEmployee(userId, offset, limit);
        if (claims.length === 0) throw new ApiError('No claims found', 404);
        return { claims, meta: { currentPage: page, totalPages: Math.ceil(total / limit) } };
    },
    getClaim: async (claimId: string, role: Role) => {
        if (!claimId) throw new ApiError('Claim ID is required', 400);

        const claim = await ClaimsDatabase.getClaimDetailsById(claimId);
        if (!claim) throw new ApiError('Claim not found', 404);

        if (!roleVisibleStatuses[role].includes(claim.status)) {
            throw new ApiError('Claim not found', 404);
        }

        return claim;
    },
    updateClaim: async (userId: string, claimId: string, amount?: number, category?: string, date?: Date, notes?: string, billFile?: Express.Multer.File) => {
        if (!userId) throw new ApiError('User ID is required', 400);
        if (!claimId) throw new ApiError('Claim ID is required', 400);
        if (amount === undefined && category === undefined && date === undefined && notes === undefined && !billFile) {
            throw new ApiError('At least one field is required to update a claim', 400);
        }
        if (amount !== undefined && amount <= 0) throw new ApiError('Amount must be greater than 0', 400);
        if (date !== undefined && date >= new Date()) throw new ApiError('Date cannot be in future', 400);

        const existingClaim = await ClaimsDatabase.getClaimDetailsById(claimId);
        if (!existingClaim || existingClaim.employeeId !== userId) throw new ApiError('Claim not found', 404);

        const updateData: Partial<typeof expenseClaims.$inferInsert> = {};

        if (amount !== undefined) {
            updateData.amount = amount.toString();
        }

        if (category !== undefined) {
            updateData.category = category;
        }

        if (date !== undefined) {
            updateData.date = date.toISOString().slice(0, 10);
        }

        if (notes !== undefined) {
            updateData.notes = notes;
        }

        let oldBillUrl = existingClaim.billUrl ?? undefined;
        if (billFile) {
            const newBillUrl = await uploadClaimImageToCloudinary(billFile, userId);
            updateData.billUrl = newBillUrl;
        }

        updateData.updatedAt = new Date();

        const updatedClaim = await ClaimsDatabase.updateClaim(userId, claimId, updateData);
        if (!updatedClaim) throw new ApiError('Claim not found', 404);

        if (billFile && oldBillUrl) {
            await deleteClaimImageFromCloudinary(oldBillUrl);
        }

        await ClaimsDatabase.createClaimAction(claimId, userId, 'edited');
        return updatedClaim;
    },
    submitClaim: async (userId: string, claimId: string, notes?: string) => {
        if (!userId) throw new ApiError('User ID is required', 400);
        if (!claimId) throw new ApiError('Claim ID is required', 400);

        const claim = await ClaimsDatabase.getClaimByIdForEmployee(userId, claimId);
        if (!claim) throw new ApiError('Claim not found', 404);
        if (claim.status !== 'draft') throw new ApiError('Only draft claims can be submitted', 400);

        const submittedClaim = await ClaimsDatabase.submitClaim(userId, claimId, notes);
        if (!submittedClaim) throw new ApiError('Claim not found', 404);

        await ClaimsDatabase.createClaimAction(claimId, userId, 'submitted');
        return submittedClaim;
    },
    approveClaim: async (userId: string, claimId: string) => {
        if (!userId) throw new ApiError('User ID is required', 400);
        if (!claimId) throw new ApiError('Claim ID is required', 400);

        const claim = await ClaimsDatabase.getClaimById(claimId);
        if (!claim) throw new ApiError('Claim not found', 404);
        if (claim.status !== 'submitted') throw new ApiError('Only submitted claims can be approved', 400);

        const approvedClaim = await ClaimsDatabase.approveClaim(claimId);
        if (!approvedClaim) throw new ApiError('Claim not found', 404);

        await ClaimsDatabase.createClaimAction(claimId, userId, 'approved');
        return approvedClaim;
    },
    disburseClaim: async (userId: string, claimId: string) => {
        if (!userId) throw new ApiError('User ID is required', 400);
        if (!claimId) throw new ApiError('Claim ID is required', 400);

        const claim = await ClaimsDatabase.getClaimById(claimId);
        if (!claim) throw new ApiError('Claim not found', 404);
        if (claim.status !== 'approved') throw new ApiError('Only approved claims can be disbursed', 400);

        const disbursedClaim = await ClaimsDatabase.disburseClaim(claimId);
        if (!disbursedClaim) throw new ApiError('Claim not found', 404);

        await ClaimsDatabase.createClaimAction(claimId, userId, 'disbursed');
        return disbursedClaim;
    },
    rejectClaim: async (userId: string, role: Role, claimId: string, notes: string) => {
        if (!userId) throw new ApiError('User ID is required', 400);
        if (!claimId) throw new ApiError('Claim ID is required', 400);
        if (!notes?.trim()) throw new ApiError('Notes are required', 400);

        const claim = await ClaimsDatabase.getClaimById(claimId);
        if (!claim) throw new ApiError('Claim not found', 404);

        if (role === 'manager') {
            if (claim.status !== 'submitted') {
                throw new ApiError('Manager can only reject submitted claims', 400);
            }

            const rejectedClaim = await ClaimsDatabase.rejectClaim(claimId, 'submitted');
            if (!rejectedClaim) throw new ApiError('Claim not found', 404);
            await ClaimsDatabase.createClaimAction(claimId, userId, 'rejected', notes);
            return rejectedClaim;
        }

        if (role === 'finance') {
            if (claim.status !== 'approved') {
                throw new ApiError('Finance can only reject approved claims', 400);
            }

            const rejectedClaim = await ClaimsDatabase.rejectClaim(claimId, 'approved');
            if (!rejectedClaim) throw new ApiError('Claim not found', 404);
            await ClaimsDatabase.createClaimAction(claimId, userId, 'rejected', notes);
            return rejectedClaim;
        }

        throw new ApiError('Only manager or finance can reject claims', 403);
    },
    deleteClaim: async (userId: string, claimId: string) => {
        if (!userId) throw new ApiError('User ID is required', 400);
        if (!claimId) throw new ApiError('Claim ID is required', 400);

        const claim = await ClaimsDatabase.getClaimDetailsById(claimId);
        if (!claim || claim.employeeId !== userId) throw new ApiError('Claim not found', 404);

        if (claim.status === 'draft') {
            const deletedClaim = await ClaimsDatabase.hardDeleteClaim(userId, claimId);
            if (!deletedClaim) throw new ApiError('Claim not found', 404);
            if (claim.billUrl) {
                await deleteClaimImageFromCloudinary(claim.billUrl);
            }
            return deletedClaim;
        }

        if (claim.status === 'submitted') {
            const deletedClaim = await ClaimsDatabase.softDeleteClaim(userId, claimId);
            if (!deletedClaim) throw new ApiError('Claim not found', 404);
            await ClaimsDatabase.createClaimAction(claimId, userId, 'deleted');
            return deletedClaim;
        }

        throw new ApiError('Only draft or submitted claims can be deleted', 400);

    }
}