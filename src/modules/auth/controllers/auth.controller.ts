import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import {
    LoginDto,
    RegisterDto,
    ResendTokenDto,
    UpdatePasswordDto,
    TokenVerificationDto,
} from "../dtos/auth.dto";

export class AuthController {
    constructor(private authService: AuthService) {}

    async register(req: Request, res: Response) {
        const { fullName, email, role }: RegisterDto = req.body;

        const isNewUser = await this.authService.registerUser(
            fullName,
            email,
            role
        );

        if (!isNewUser) {
            res.status(201).json({
                status: true,
                message: "Token Verification resent",
                data: { email },
            });
        } else {
            res.status(201).json({
                status: true,
                message: "User registered successfully",
                data: { email },
            });
        }
    }

    async tokenVerification(req: Request, res: Response) {
        const { email, token }: TokenVerificationDto = req.body;
        const verify = await this.authService.tokenVerification(email, token);

        res.status(200).json({
            status: true,
            message: "Token verified successfully",
            data: {
                userId: verify?.id,
                email: verify?.email,
            },
        });
    }

    async resendToken(req: Request, res: Response) {
        const { email }: ResendTokenDto = req.body;
        await this.authService.updateTokenVerification(email);

        res.status(200).json({
            status: true,
            message: "Token Verification updated",
        });
    }

    async updatePassword(req: Request, res: Response) {
        const { userId, oldPassword, newPassword }: UpdatePasswordDto =
            req.body;

        const storedPassword = await this.authService.updatePassword(
            userId,
            oldPassword,
            newPassword
        );

        res.status(201).json({
            status: true,
            message: "Password updated successfully",
            data: {
                id: storedPassword.id,
                email: storedPassword.email,
                fullName: storedPassword.fullName,
            },
        });
    }

    async login(req: Request, res: Response) {
        const { email, password, ip, userAgent }: LoginDto = req.body;

        const user = await this.authService.loginUser(
            email,
            password,
            ip,
            userAgent
        );

        res.status(200).json({
            status: true,
            message: "login successful",
            data: {
                accessToken: user.accessToken,
                refreshToken: user.refreshToken,
            },
        });
    }

    async logout(req: Request, res: Response) {
        const { refreshToken } = req.body;
        await this.authService.logoutUser(refreshToken);

        res.status(200).json({
            status: true,
            message: "Logout successful",
        });
    }

    async refreshToken(req: Request, res: Response) {
        const { refreshToken } = req.body;
        const newToken = await this.authService.refreshToken(refreshToken);

        res.status(201).json({
            status: true,
            message: "Access token refreshed",
            data: {
                accessToken: newToken.accessToken,
            },
        });
    }
}
