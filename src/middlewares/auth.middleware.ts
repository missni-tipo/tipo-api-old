import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "./error.middleware";
import { config } from "../config/config";
import { CustomRequest } from "../shared/models/customRequest.model";

const authMiddleware = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Unauthorized: No token provided");
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, config.JWT_SECRET) as {
            id: string;
            role: string;
        };

        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(403, "Forbidden: Invalid or expired token");
        }
        next(error);
    }
};

export default authMiddleware;
