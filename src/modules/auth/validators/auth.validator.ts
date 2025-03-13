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

    static validate = (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, errors.array()[0].msg);
        }
        next();
    };
}
