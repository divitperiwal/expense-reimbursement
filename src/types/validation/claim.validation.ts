import z from "zod";

export const createClaimSchema = z.object({
    amount: z.coerce.number().positive().min(1),
    category: z.string(),
    date: z.coerce.date(),
    notes: z.string().trim().max(1000).optional()
})

export const updateClaimSchema = z.object({
    amount: z.coerce.number().positive().min(1).optional(),
    category: z.string().optional(),
    date: z.coerce.date().optional(),
    notes: z.string().trim().max(1000).optional()
})
export const submitClaimSchema = z.object({
    notes: z.string().trim().max(1000).optional()
})
export const getClaimSchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    status: z.enum(["draft", "submitted", "approved", "rejected", "disbursed"]).optional()
})

export const rejectClaimSchema = z.object({
    notes: z.string().trim().min(1).max(1000)
})