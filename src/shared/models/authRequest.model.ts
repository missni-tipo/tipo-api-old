import { Request } from "express";

export interface AuthUser {
    userId: string;
    roleId: string;
    role: string;
}

export interface AuthRequest extends Request {
    auth: AuthUser;
}
