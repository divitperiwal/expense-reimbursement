export interface SuccessResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: any;
}

export interface ErrorResponse {
    success: boolean;
    statusCode: number;
    message: string;
    errors?: any;
}

export interface ApiErrorResponse {
    success: boolean;
    statusCode: number;
    message: string;
    code: number;
    details?: any;
}

export type User = {
    id: string;
    name: string;
    role: Role;
}

export type Role = 'employee' | 'manager' | 'finance' | 'admin';
export type ClaimStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'disbursed';

export const roleVisibleStatuses: Record<Role, ClaimStatus[]> = {
    employee: ['draft', 'submitted', 'approved', 'rejected', 'disbursed'],
    manager: ['submitted', 'approved', 'rejected', 'disbursed'],
    finance: ['approved', 'rejected', 'disbursed'],
    admin: ['draft', 'submitted', 'approved', 'rejected', 'disbursed']
};