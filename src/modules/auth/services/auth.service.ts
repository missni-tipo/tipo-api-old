import { AuthRepository } from "../repositories/auth.repository";
import {
    generateJWTToken,
    generateVerifyCode,
} from "../../../utils/token.util";
import { $Enums } from "@prisma/client";
import { hashValue, verifyHashedValue } from "../../../utils/hashing";
import { UserData } from "../../../shared/models/user.model";
import { ApiError } from "../../../middlewares/errorHandler.middleware";
import jwt from "jsonwebtoken";
import { config } from "../../../config/config";
export class AuthService {
    private authRepo: AuthRepository;

    constructor() {
        this.authRepo = new AuthRepository();
    }

    async registerUser(
        fullName: string,
        email: string,
        role: string
    ): Promise<Boolean> {
        const existingUser = await this.authRepo.findUserEmail(email);
        if (existingUser) {
            if (
                existingUser.passwordHash !== null ||
                existingUser.status !== "INACTIVE"
            ) {
                throw new ApiError(400, "Email is already registered");
            }

            await this.updateTokenVerification(existingUser.email);
            return false;
        }

        const existingRole = await this.authRepo.findRole({
            name: role.toLowerCase(),
        });
        if (!existingRole) throw new ApiError(404, "Role Not Found");

        const createUser = await this.authRepo.createUser({
            fullName,
            email,
        });

        await this.authRepo.createUserRole({
            userId: createUser.id,
            roleId: existingRole.id,
        });

        const generateToken = generateVerifyCode();
        const hashedToken = await hashValue(generateToken);
        console.log({ generateToken, hashedToken }); //for debuging

        await this.authRepo.createTokenVerification({
            email: createUser.email,
            userId: createUser.id,
            token: hashedToken,
            expires: BigInt(Date.now() + 1 * 60 * 1000),
            isUsed: false,
            type: $Enums.TokenVerificationType.EMAIL_VERIFICATION,
        });
        return true;
    }

    async updateTokenVerification(email: string): Promise<Boolean> {
        const storedToken = await this.authRepo.findTokenVerification({
            email,
        });
        if (!storedToken) throw new ApiError(404, "Token Not Found");

        if (Date.now() < Number(storedToken?.expires) && !storedToken.isUsed) {
            throw new ApiError(400, "Token is still valid and has not expired");
        }

        const generateToken = generateVerifyCode();
        const hashedToken = await hashValue(generateToken);
        console.log({ generateToken, hashedToken }); //for debuging

        await this.authRepo.updateTokenVerification(email, {
            token: hashedToken,
            expires: BigInt(Date.now() + 1 * 60 * 1000),
            isUsed: false,
            type: $Enums.TokenVerificationType.EMAIL_VERIFICATION,
        });

        return true;
    }

    async tokenVerification(
        email: string,
        token: string
    ): Promise<Partial<UserData> | null> {
        const storedToken = await this.authRepo.findTokenVerification({
            email,
        });

        if (!storedToken) throw new ApiError(404, "Token not found");

        const isTokenValid = await verifyHashedValue(token, storedToken.token);
        if (
            !isTokenValid ||
            storedToken.isUsed ||
            Date.now() > Number(storedToken.expires)
        ) {
            throw new ApiError(400, "Invalid Token");
        }

        await this.authRepo.updateTokenVerification(storedToken.email, {
            isUsed: true,
        });

        return { id: storedToken.userId, email: storedToken.email };
    }

    async updatePassword(
        userId: string,
        oldPassword: string,
        newPassword: string
    ): Promise<Partial<UserData>> {
        const user = await this.authRepo.findUserById(userId);
        if (!user) throw new ApiError(404, "User Not Found");

        const verificationToken = await this.authRepo.findTokenVerification({
            email: user.email,
        });
        if (verificationToken && !verificationToken.isUsed) {
            throw new ApiError(
                400,
                "Account is not verified. Please check your email to verify your account."
            );
        }

        if (user.passwordHash) {
            if (!oldPassword) {
                throw new ApiError(400, "Old password is required");
            }

            const isOldPasswordValid = await verifyHashedValue(
                oldPassword,
                user.passwordHash
            );
            if (!isOldPasswordValid) {
                throw new ApiError(400, "Incorrect old password");
            }
        }

        const hashedPassword = await hashValue(newPassword);
        await this.authRepo.updatePassword(user.id, {
            passwordHash: hashedPassword,
            status: "ACTIVE",
        });

        return { id: user.id, email: user.email, fullName: user.fullName };
    }

    async loginUser(
        email: string,
        password: string,
        ip: string,
        userAgent: string
    ) {
        const user = await this.authRepo.findUserEmail(email);
        if (
            !user ||
            !user.passwordHash ||
            !(await verifyHashedValue(password, user.passwordHash))
        ) {
            throw new ApiError(400, "Invalid email or password");
        }

        const userRole = await this.authRepo.findUserRole(user.id);
        if (!userRole) throw new ApiError(400, "User Not Found");

        const role = await this.authRepo.findRoleById(userRole.roleId);
        const userPayload = {
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
            roleId: role?.id,
            role: role?.name,
        };

        const accessToken = generateJWTToken(
            userPayload,
            config.JWT_SECRET,
            "1h"
        );

        const refreshToken = generateJWTToken(
            userPayload,
            config.JWT_REFRESH_SECRET,
            "7d"
        );

        await this.authRepo.createSession({
            userId: user.id,
            refreshToken,
            expires: BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000),
            ip,
            userAgent,
        });

        return { accessToken, refreshToken };
    }

    async logoutUser(refreshToken: string) {
        return await this.authRepo.deleteSession(refreshToken);
    }

    async refreshToken(oldRefreshToken: string) {
        const session = await this.authRepo.findSession({
            refreshToken: oldRefreshToken,
        });
        if (!session) throw new ApiError(400, "Invalid refresh token");

        const decoded = jwt.verify(
            oldRefreshToken,
            config.JWT_REFRESH_SECRET
        ) as { userId: string };
        const user = await this.authRepo.findUserById(decoded.userId);
        if (!user) throw new ApiError(400, "User Not Found");

        const userRole = await this.authRepo.findUserRole(user.id);
        if (!userRole) throw new ApiError(400, "User Not Found");

        const role = await this.authRepo.findRoleById(userRole.roleId);
        const userPayload = {
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
            roleId: role?.id,
            role: role?.name,
        };

        const newAccessToken = generateJWTToken(
            userPayload,
            config.JWT_SECRET,
            "1h"
        );

        return { accessToken: newAccessToken };
    }

    // async loginWithOAuth(
    //     provider: string,
    //     providerId: string,
    //     email: string,
    //     name: string
    // ) {
    //     let user = await FindUserRepository.findUserByEmail(email);
    //     if (!user) {
    //         user = await AuthRepository.createUser(name, email, null);
    //     }

    //     await AuthRepository.createOAuthAccount(
    //         user.id,
    //         provider,
    //         providerId,
    //         ""
    //     );

    //     const accessToken = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
    //         expiresIn: "1h",
    //     });
    //     return { accessToken };
    // }
}
