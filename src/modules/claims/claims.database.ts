import db from "@/config/drizzle.config.js";
import { claimActions, expenseClaims } from "@/database/schema/index.js";
import type { ClaimStatus } from "@/types/common.js";
import { and, count, desc, eq, inArray, isNull } from "drizzle-orm";

export const ClaimsDatabase = {
    getAllClaims: async (offset: number, pageSize: number) => {
        const [claims, [{ count: total }]] = await Promise.all([
            db.select().from(expenseClaims).where(isNull(expenseClaims.deletedAt)).orderBy(desc(expenseClaims.createdAt)).limit(pageSize).offset(offset),
            db.select({
                count: count()
            }).from(expenseClaims).where(isNull(expenseClaims.deletedAt))
        ]);
        return { claims, total };
    },
    getAllClaimsByStatus: async (offset: number, pageSize: number, queryStatus: ClaimStatus) => {
        const [claims, [{ count: total }]] = await Promise.all([
            db.select().from(expenseClaims).where(and(isNull(expenseClaims.deletedAt), eq(expenseClaims.status, queryStatus))).orderBy(desc(expenseClaims.createdAt)).limit(pageSize).offset(offset),
            db.select({
                count: count()
            }).from(expenseClaims).where(and(isNull(expenseClaims.deletedAt), eq(expenseClaims.status, queryStatus)))
        ]);
        return { claims, total };
    },
    getAllClaimsByStatuses: async (offset: number, pageSize: number, queryStatuses: ClaimStatus[]) => {
        const [claims, [{ count: total }]] = await Promise.all([
            db.select().from(expenseClaims).where(and(isNull(expenseClaims.deletedAt), inArray(expenseClaims.status, queryStatuses))).orderBy(desc(expenseClaims.createdAt)).limit(pageSize).offset(offset),
            db.select({
                count: count()
            }).from(expenseClaims).where(and(isNull(expenseClaims.deletedAt), inArray(expenseClaims.status, queryStatuses)))
        ]);
        return { claims, total };
    },
    getClaimsByEmployee: async (employeeId: string, offset: number, pageSize: number) => {
        const [claims, [{ count: total }]] = await Promise.all([
            db.select().from(expenseClaims).where(and(isNull(expenseClaims.deletedAt), eq(expenseClaims.employeeId, employeeId))).orderBy(desc(expenseClaims.createdAt)).limit(pageSize).offset(offset),
            db.select({
                count: count()
            }).from(expenseClaims).where(and(isNull(expenseClaims.deletedAt), eq(expenseClaims.employeeId, employeeId)))
        ]);
        return { claims, total };
    },
    getClaimsByEmployeeAndStatus: async (employeeId: string, offset: number, pageSize: number, queryStatus: ClaimStatus) => {
        const [claims, [{ count: total }]] = await Promise.all([
            db.select().from(expenseClaims).where(and(isNull(expenseClaims.deletedAt), eq(expenseClaims.employeeId, employeeId), eq(expenseClaims.status, queryStatus))).orderBy(desc(expenseClaims.createdAt)).limit(pageSize).offset(offset),
            db.select({
                count: count()
            }).from(expenseClaims).where(and(isNull(expenseClaims.deletedAt), eq(expenseClaims.employeeId, employeeId), eq(expenseClaims.status, queryStatus)))
        ]);
        return { claims, total };
    },
    createClaim: async (userId: string, amount: number, category: string, date: Date, notes?: string, billUrl?: string) => {
        const [claimId] = await db.insert(expenseClaims).values({
            amount: amount.toString(),
            employeeId: userId,
            category,
            date: date.toISOString().slice(0, 10),
            notes,
            billUrl,
            status: 'draft'
        }).returning({ id: expenseClaims.id });

        return claimId ?? null;
    },
    updateClaim: async (userId: string, claimId: string, updateData: Partial<typeof expenseClaims.$inferInsert>) => {
        const [updatedClaim] = await db.update(expenseClaims)
            .set(updateData)
            .where(and(eq(expenseClaims.id, claimId), eq(expenseClaims.employeeId, userId), isNull(expenseClaims.deletedAt)))
            .returning({ id: expenseClaims.id });

        return updatedClaim ?? null;
    },
    submitClaim: async (userId: string, claimId: string, notes?: string) => {
        const [submittedClaim] = await db.update(expenseClaims)
            .set({
                status: 'submitted',
                updatedAt: new Date(),
                ...(notes !== undefined ? { notes } : {})
            })
            .where(and(eq(expenseClaims.id, claimId), eq(expenseClaims.employeeId, userId), isNull(expenseClaims.deletedAt)))
            .returning({ id: expenseClaims.id });

        return submittedClaim ?? null;
    },
    getClaimByIdForEmployee: async (userId: string, claimId: string) => {
        const [claim] = await db.select({
            id: expenseClaims.id,
            status: expenseClaims.status
        }).from(expenseClaims).where(and(eq(expenseClaims.id, claimId), eq(expenseClaims.employeeId, userId), isNull(expenseClaims.deletedAt)));

        return claim ?? null;
    },
    getClaimById: async (claimId: string) => {
        const [claim] = await db.select({
            id: expenseClaims.id,
            status: expenseClaims.status
        }).from(expenseClaims).where(and(eq(expenseClaims.id, claimId), isNull(expenseClaims.deletedAt)));

        return claim ?? null;
    },
    getClaimDetailsById: async (claimId: string) => {
        const [claim] = await db.select().from(expenseClaims).where(and(eq(expenseClaims.id, claimId), isNull(expenseClaims.deletedAt)));
        return claim ?? null;
    },
    approveClaim: async (claimId: string) => {
        const [approvedClaim] = await db.update(expenseClaims)
            .set({ status: 'approved', updatedAt: new Date() })
            .where(and(eq(expenseClaims.id, claimId), eq(expenseClaims.status, 'submitted'), isNull(expenseClaims.deletedAt)))
            .returning({ id: expenseClaims.id });

        return approvedClaim ?? null;
    },
    disburseClaim: async (claimId: string) => {
        const [disbursedClaim] = await db.update(expenseClaims)
            .set({ status: 'disbursed', updatedAt: new Date() })
            .where(and(eq(expenseClaims.id, claimId), eq(expenseClaims.status, 'approved'), isNull(expenseClaims.deletedAt)))
            .returning({ id: expenseClaims.id });

        return disbursedClaim ?? null;
    },
    rejectClaim: async (claimId: string, currentStatus: 'submitted' | 'approved') => {
        const [rejectedClaim] = await db.update(expenseClaims)
            .set({ status: 'rejected', updatedAt: new Date() })
            .where(and(eq(expenseClaims.id, claimId), eq(expenseClaims.status, currentStatus), isNull(expenseClaims.deletedAt)))
            .returning({ id: expenseClaims.id });

        return rejectedClaim ?? null;
    },
    softDeleteClaim: async (userId: string, claimId: string) => {
        const [deletedClaim] = await db.update(expenseClaims)
            .set({ deletedAt: new Date(), updatedAt: new Date() })
            .where(and(eq(expenseClaims.id, claimId), eq(expenseClaims.employeeId, userId), isNull(expenseClaims.deletedAt)))
            .returning({ id: expenseClaims.id });

        return deletedClaim ?? null;
    },
    hardDeleteClaim: async (userId: string, claimId: string) => {
        await db.delete(claimActions).where(eq(claimActions.claimId, claimId));

        const [deletedClaim] = await db.delete(expenseClaims)
            .where(and(eq(expenseClaims.id, claimId), eq(expenseClaims.employeeId, userId), eq(expenseClaims.status, 'draft'), isNull(expenseClaims.deletedAt)))
            .returning({ id: expenseClaims.id });

        return deletedClaim ?? null;
    },
    createClaimAction: async (claimId: string, actorId: string, action: "created" | "edited" | "deleted" | "submitted" | "approved" | "disbursed" | "rejected", note?: string) => {
        await db.insert(claimActions).values({
            claimId,
            actorId,
            action,
            note
        });
    }

}