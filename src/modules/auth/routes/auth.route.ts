import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { AuthValidator } from "../validators/auth.validator";

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post(
    "/register",
    AuthValidator.registerValidation,
    AuthValidator.validate,
    authController.register.bind(authController)
);

router.post(
    "/resend-token",
    AuthValidator.resendTokenValidation,
    AuthValidator.validate,
    authController.resendToken.bind(authController)
);

router.post(
    "/verify-token",
    AuthValidator.verifyTokenValidation,
    AuthValidator.validate,
    authController.verifyToken.bind(authController)
);

router.put(
    "/update-password",
    AuthValidator.updatePasswordValidation,
    AuthValidator.validate,
    authController.updatePassword.bind(authController)
);

export default router;
