import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../../middlewares/error.middleware";

export class AuthValidator {
    static registerValidation = [
        body("fullName")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Full name must be at least 2 characters long"),
        body("email")
            .isEmail()
            .withMessage("Invalid email address")
            .normalizeEmail(),
        body("role").notEmpty().withMessage("role is required"),
    ];

    static resendTokenValidation = [
        body("email")
            .isEmail()
            .withMessage("Invalid email address")
            .normalizeEmail()
            .notEmpty()
            .withMessage("Email is required"),
    ];

    static verifyTokenValidation = [
        body("email").isEmail().withMessage("Invalid email address"),
        body("token").notEmpty().withMessage("Token is required"),
    ];

    static updatePasswordValidation = [
        body("userId").trim().notEmpty().withMessage("User Id is required"),
        body("newPassword")
            .notEmpty()
            .withMessage("New password is required")
            .isLength({ min: 6 })
            .withMessage("New password must be at least 6 characters long")
            .custom((value, { req }) => {
                if (value === req.body.oldPassword) {
                    throw new Error(
                        "New password must be different from old password"
                    );
                }
                return true;
            }),
    ];

    static loginValidation = [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid email address"),
        body("password").trim().notEmpty().withMessage("Password is required"),
        body("ip").notEmpty().withMessage("IP address user must be included"),
        body("userAgent").notEmpty().withMessage("User agent must be included"),
    ];

    static validate = (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        const mapErrors = () => {
            return errors.array().reduce(
                (acc, err) => {
                    const field = (err as any).path;

                    if (!acc[field]) acc[field] = [];

                    acc[field].push(err.msg);

                    return acc;
                },
                {} as Record<string, string[]>
            );
        };

        if (!errors.isEmpty()) {
            throw new ApiError(400, "Invalid Input", mapErrors());
        }
        next();
    };
}
