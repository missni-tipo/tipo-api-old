import { body, param } from "express-validator";

export class RoleValidator {
    static getRole = [
        param("id")
            .notEmpty()
            .withMessage("Role ID is required")
            .isUUID()
            .withMessage("Invalid Format ID"),
    ];

    static createRole = [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Role Name is required")
            .isLength({ min: 3 })
            .withMessage("Role Name must be at least 3 character long"),
    ];

    static updateRole = [
        body("name").trim().notEmpty().withMessage("Role Name is required"),
    ];

    static deleteRole = [
        param("id")
            .isUUID()
            .withMessage("Invalid Format ID")
            .notEmpty()
            .withMessage("Role ID is required"),
    ];

    static reactivateRole = [
        param("id")
            .isUUID()
            .withMessage("Invalid Format ID")
            .notEmpty()
            .withMessage("Role ID is required"),
    ];
}
