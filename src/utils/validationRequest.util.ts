import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../middlewares/error.middleware";

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const mappedErrors = errors.array().reduce(
            (acc, err) => {
                const field = (err as any).path;
                acc[field] = acc[field] || [];
                acc[field].push(err.msg);
                return acc;
            },
            {} as Record<string, string[]>
        );

        throw new ApiError(400, "Invalid Input", mappedErrors);
    }

    next();
};
