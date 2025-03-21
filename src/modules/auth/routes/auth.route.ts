import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { AuthValidator } from "../validators/auth.validator";
import { validateRequest } from "../../../utils/validationRequest.util";

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post(
    "/register",
    AuthValidator.registerValidation,
    validateRequest,
    authController.register.bind(authController)
);

router.post(
    "/resend-token",
    AuthValidator.resendTokenValidation,
    validateRequest,
    authController.resendToken.bind(authController)
);

router.post(
    "/verify-token",
    AuthValidator.tokenVerificationValidation,
    validateRequest,
    authController.tokenVerification.bind(authController)
);

router.put(
    "/update-password",
    AuthValidator.updatePasswordValidation,
    validateRequest,
    authController.updatePassword.bind(authController)
);

router.post(
    "/login",
    AuthValidator.loginValidation,
    validateRequest,
    authController.login.bind(authController)
);

router.post(
    "/logout",
    AuthValidator.logoutValidation,
    validateRequest,
    authController.logout.bind(authController)
);

router.post(
    "/refresh-token",
    AuthValidator.refreshTokenValidation,
    validateRequest,
    authController.refreshToken.bind(authController)
);

export default router;
