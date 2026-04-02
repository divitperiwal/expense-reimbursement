import type { Request, Response } from "express";
import { UserService } from "./user.service.js";
import { sendSuccess } from "@/utils/constants/response.js";
import { getUserSchema, updateUserSchema } from "@/types/validation/user.validation.js";

export const handleGetSelf = async (req: Request, res: Response) => {
    const requester = req.user;
    const user = await UserService.getUser(requester.id);
    sendSuccess(res, 200, 'User retrieved successfully', user);
}
export const handleGetUser = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = await UserService.getUser(id);
    sendSuccess(res, 200, 'User retrieved successfully', user);
}

export const handleGetAllUsers = async (req: Request, res: Response) => {
    const { page } = getUserSchema.parse(req.query);
    const users = await UserService.getAllUsers(page);
    sendSuccess(res, 200, 'Users retrieved successfully', users);
}
export const handleUpdateRole = async (req: Request, res: Response) => {
    const { role } = updateUserSchema.parse(req.body);
    const id = req.params.id as string;
    await UserService.updateUserRole(id, role);
    sendSuccess(res, 200, 'User role updated successfully');

}
export const handleUpdateStatus = async (req: Request, res: Response) => {
    const { status } = updateUserSchema.parse(req.body);
    const id = req.params.id as string;

    await UserService.updateUserStatus(id, status);
    sendSuccess(res, 200, 'User status updated successfully');

}