import { Router } from "express";
import { RoleService } from "../services/role.service";
import { RoleController } from "../controllers/role.controller";
import { RoleValidator } from "../validators/role.validator";
import { validateRequest } from "../../../utils/validationRequest.util";
import { RoleRepository } from "../repositories/role.repository";
import { BaseRoleRepository } from "../../../shared/repositories/role.repository";

const router = Router();
const baseRoleRepo = new BaseRoleRepository();
const roleRepo = new RoleRepository(baseRoleRepo);
const roleService = new RoleService(roleRepo);
const roleController = new RoleController(roleService);

router.get(
    "/:id",
    RoleValidator.getRole,
    validateRequest,
    roleController.getRole.bind(roleController)
);

router.post(
    "/",
    RoleValidator.createRole,
    validateRequest,
    roleController.createRole.bind(roleController)
);

router.put(
    "/:id",
    RoleValidator.updateRole,
    validateRequest,
    roleController.updateRole.bind(roleController)
);

router.delete(
    "/:id",
    RoleValidator.deleteRole,
    validateRequest,
    roleController.deleteRole.bind(roleController)
);

router.patch(
    "/:id/reactivate",
    RoleValidator.reactivateRole,
    validateRequest,
    roleController.reactiveRole.bind(roleController)
);

export default router;
