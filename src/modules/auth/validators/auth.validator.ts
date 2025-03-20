import { body } from "express-validator";

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

    static tokenVerificationValidation = [
        body("email").isEmail().withMessage("Invalid email address"),
        body("token").notEmpty().withMessage("Token is required"),
    ];

    static updatePasswordValidation = [
        body("userId")
            .trim()
            .notEmpty()
            .withMessage("User ID is required")
            .isUUID()
            .withMessage("Invalid User ID format"),

        body("newPassword")
            .notEmpty()
            .withMessage("New password is required")
            .isLength({ min: 8 })
            .withMessage("New password must be at least 8 characters long")
            .matches(/\d/)
            .withMessage("New password must contain at least one number")
            .matches(/[a-zA-Z]/)
            .withMessage("New password must contain at least one letter")
            .custom((value, { req }) => {
                if (req.body.oldPassword && value === req.body.oldPassword) {
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

    static refreshTokenValidation = [
        body("refreshToken")
            .notEmpty()
            .withMessage("Refresh Token is required"),
    ];

    static logoutValidation = [
        body("refreshToken")
            .notEmpty()
            .withMessage("Refresh Token is required"),
    ];
}
