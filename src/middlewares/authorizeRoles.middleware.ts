import { Response, NextFunction, Request } from "express";
import { AuthRequest } from "../shared/models/authRequest.model";
import { ApiError } from "./errorHandler.middleware";

export const authorizeRoles = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;
        try {
            const userRole = authReq.auth.role;

            if (!userRole || !allowedRoles.includes(userRole)) {
                return next(new ApiError(403, "Access denied"));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
