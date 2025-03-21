import { body, param } from "express-validator";
import { ApiError } from "../../../middlewares/error.middleware";

export class UserValidator {
    static getUser = [
        param("id")
            .isUUID()
            .withMessage("Invalid ID Format")
            .notEmpty()
            .withMessage("User Id is required"),
    ];

    static updateUser = [
        body("fullName")
            .optional()
            .isString()
            .withMessage("Full Name must be a string")
            .isLength({ min: 3, max: 50 })
            .withMessage("Full Name must be between 3 and 50 characters"),

        body("gender")
            .notEmpty()
            .withMessage("Gender is required")
            .isIn(["m", "f"])
            .withMessage("Gender must be 'm' (male) or 'f' (female)"),

        body("phoneNumber")
            .notEmpty()
            .withMessage("Phone Number is required")
            .isMobilePhone("id-ID")
            .withMessage("Phone Number must be a valid Indonesian number"),

        body("birthdate")
            .notEmpty()
            .withMessage("Birthdate is required")
            .isISO8601()
            .withMessage("Birthdate must be in YYYY-MM-DD format"),

        body("domicile")
            .notEmpty()
            .withMessage("Domicile is required")
            .isString()
            .withMessage("Domicile must be a string"),
    ];

    static updatePin = [
        body("id").notEmpty().withMessage("User ID is required"),
        body("newPin")
            .notEmpty()
            .withMessage("New PIN is required")
            .isLength({ min: 6, max: 6 })
            .withMessage("PIN must be exactly 6 digits")
            .custom((value, { req }) => {
                if (req.body.oldPin && value === req.body.oldPin) {
                    throw new Error("New PIN must be different from old PIN");
                }
                return true;
            }),
    ];

    static deleteUserValidation = [
        param("id")
            .notEmpty()
            .withMessage("User ID is required")
            .isUUID()
            .withMessage("Invalid User ID format"),
    ];

    static reactivateUserValidation = [
        param("id")
            .notEmpty()
            .withMessage("User ID is required")
            .isUUID()
            .withMessage("Invalid User ID format"),
    ];
}
