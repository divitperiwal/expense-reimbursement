import z from "zod";

export const createClaimSchema = z.object({
    amount: z.number().positive().min(1),
    category: z.string(),
    date: z.coerce.date()
})

export const updateClaimSchema = z.object({
    amount: z.number().positive().min(1).optional(),
    category: z.string().optional(),
    date: z.coerce.date().optional()
})
export const getClaimSchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    status: z.enum(["draft", "submitted", "approved", "rejected", "disbursed"]).optional()
})

export const rejectClaimSchema = z.object({
    notes: z.string().trim().min(1).max(1000)
})