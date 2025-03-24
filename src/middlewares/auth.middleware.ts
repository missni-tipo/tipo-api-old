import { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorHandler.middleware";
import { verifyJWTToken } from "../utils/token.util";
import { AuthRequest, AuthUser } from "../shared/models/authRequest.model";
import { config } from "../config/config";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Unauthorized: No token provided");
        }

        const token = authHeader.split(" ")[1];
        const decoded: AuthUser = verifyJWTToken(token, config.JWT_SECRET);

        (req as AuthRequest).auth = decoded;

        next();
    } catch (error) {
        if (error instanceof Error) {
            next(new ApiError(403, error.message));
        } else {
            next(new ApiError(403, "Unknown error occurred"));
        }
    }
};

export default authMiddleware;
