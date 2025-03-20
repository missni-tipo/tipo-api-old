import { Router } from "express";
import { UserService } from "../services/user.service";
import { UserController } from "../controllers/user.controller";
import { UserValidator } from "../validators/user.validator";
import { validateRequest } from "../../../utils/validationRequest.util";

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.get(
    "/:id",
    UserValidator.getUser,
    validateRequest,
    userController.getUser.bind(userController)
);

router.put(
    "/:id",
    UserValidator.updateUser,
    validateRequest,
    userController.updateUser.bind(userController)
);

router.patch(
    "/set-pin",
    UserValidator.updatePin,
    validateRequest,
    userController.updatePin.bind(userController)
);

router.delete(
    "/:id",
    UserValidator.deleteUserValidation,
    validateRequest,
    userController.deleteUser.bind(userController)
);

router.patch(
    "/:id/reactivate",
    UserValidator.reactivateUserValidation,
    validateRequest,
    userController.reactivateUser.bind(userController)
);

export default router;
