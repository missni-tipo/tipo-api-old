import { AuthRepository } from "../repositories/auth.repository";
import { generateVerifyToken } from "../../../utils/token.util";
import { $Enums } from "@prisma/client";
import { hashValue, verifyHashedValue } from "../../../utils/password.util";
import { UserData } from "../../../shared/models/user.model";
import { ApiError } from "../../../middlewares/error.middleware";
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
                throw new ApiError(
                    400,
                    "Email is already registered and active"
                );
            }

            await this.updateToken(existingUser.email);
            return false;
        }

        const existingRole = await this.authRepo.findRole({
            name: role.toLowerCase(),
        });

        if (!existingRole) throw new ApiError(404, "Role not found");

        const createUser = await this.authRepo.createUser({
            fullName: fullName,
            email: email,
        });

        await this.authRepo.createUserRole({
            userId: createUser.id,
            roleId: existingRole.id,
        });

        const generateToken = generateVerifyToken();

        await this.authRepo.createVerificationToken({
            email: createUser.email,
            userId: createUser.id,
            token: await hashValue(generateToken),
            expires: BigInt(Date.now() + 1 * 60 * 1000),
            isUsed: false,
            type: $Enums.VerificationTokenType.EMAIL_VERIFICATION,
        });

        return true;
    }

    async updateToken(email: string): Promise<Boolean> {
        const storedToken = await this.authRepo.findVerificationToken({
            email,
        });

        if (!storedToken) throw new ApiError(404, "Token not found");

        if (
            Date.now() < Number(storedToken?.expires) &&
            storedToken.isUsed === false
        )
            throw new ApiError(400, "Token is still valid and has not expired");

        const generateToken = generateVerifyToken();
        console.log({ generateToken });

        await this.authRepo.updateVerificationToken(email, {
            token: await hashValue(generateToken),
            expires: BigInt(Date.now() + 1 * 60 * 1000),
            isUsed: false,
            type: $Enums.VerificationTokenType.EMAIL_VERIFICATION,
        });

        return true;
    }

    async verifyToken(
        email: string,
        token: string
    ): Promise<Partial<UserData> | null> {
        const storedToken = await this.authRepo.findVerificationToken({
            email,
        });

        if (!storedToken) throw new ApiError(404, "Token not found");

        const isTokenValid = await verifyHashedValue(token, storedToken.token);

        if (!isTokenValid) throw new ApiError(400, "Invalid token");

        if (storedToken.isUsed)
            throw new ApiError(400, "Token has already been used");

        if (Date.now() > Number(storedToken.expires))
            throw new ApiError(400, "Token expired");

        await this.authRepo.updateVerificationToken(storedToken.email, {
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
        if (!user) throw new ApiError(400, "User Not Found");

        const verificationToken = await this.authRepo.findVerificationToken({
            email: user.email,
        });

        if (verificationToken && !verificationToken.isUsed)
            throw new ApiError(400, "Account has not been verified");

        if (user.passwordHash) {
            if (!oldPassword)
                throw new ApiError(400, "Old Password has been required");

            const isMatch = await verifyHashedValue(
                oldPassword,
                user.passwordHash
            );
            if (!isMatch) throw new ApiError(400, "Incorrect old password");
        }

        const hashedPassword = await hashValue(newPassword);

        await this.authRepo.updatePassword(user.id, {
            passwordHash: hashedPassword,
            status: "ACTIVE",
        });

        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
        };
    }

    async loginUser(
        email: string,
        password: string,
        ip: string,
        userAgent: string
    ) {
        const user = await this.authRepo.findUserEmail(email);
        if (!user) throw new ApiError(400, "Invalid email or password");

        if (!user.passwordHash)
            throw new ApiError(400, "Account has not been verified");

        const isPasswordValid = await verifyHashedValue(
            password,
            user.passwordHash
        );
        if (!isPasswordValid)
            throw new ApiError(400, "Invalid email or password");

        const userRole = await this.authRepo.findUserRole(user.id);
        if (!userRole) throw new ApiError(400, "User role not found");

        const role = await this.authRepo.findRoleById(userRole.roleId);
        const userPayload = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: role?.name,
        };

        const accessToken = jwt.sign(userPayload, config.JWT_SECRET, {
            expiresIn: "1h",
        });
        const refreshToken = jwt.sign(userPayload, config.JWT_REFRESH_SECRET, {
            expiresIn: "7d",
        });

        await this.authRepo.createSession({
            userId: user.id,
            refreshToken,
            expires: BigInt(Math.floor(Date.now() + 7 * 24 * 60 * 60 * 1000)),
            ip,
            userAgent,
        });

        return { accessToken, refreshToken };
    }

    // static async logoutUser(refreshToken: string) {
    //     return await AuthRepository.deleteSession(refreshToken);
    // }

    // static async refreshToken(oldRefreshToken: string) {
    //     try {
    //         const decoded = jwt.verify(
    //             oldRefreshToken,
    //             config.JWT_REFRESH_SECRET
    //         ) as { userId: string };
    //         const user = await FindUserRepository.findUserById(decoded.userId);
    //         if (!user) throw new Error("User tidak ditemukan");

    //         const newAccessToken = jwt.sign(
    //             { userId: user.id },
    //             config.JWT_SECRET,
    //             { expiresIn: "1h" }
    //         );
    //         return { accessToken: newAccessToken };
    //     } catch (err) {
    //         throw new Error("Refresh token tidak valid");
    //     }
    // }

    // static async verifyEmail(token: string) {
    //     const verification = await AuthRepository.findVerificationToken(token);
    //     if (!verification || verification.expires < new Date()) {
    //         throw new Error(
    //             "Token verifikasi tidak valid atau sudah kedaluwarsa"
    //         );
    //     }

    //     await AuthRepository.updateUserEmailVerified(verification.email);
    //     await AuthRepository.deleteVerificationToken(token);
    // }

    // static async resetPassword(token: string, newPassword: string) {
    //     const verification = await AuthRepository.findVerificationToken(token);
    //     if (!verification || verification.expires < new Date()) {
    //         throw new Error(
    //             "Token reset password tidak valid atau sudah kedaluwarsa"
    //         );
    //     }

    //     const hashedPassword = await bcrypt.hash(newPassword, 10);
    //     await AuthRepository.updateUserPassword(
    //         verification.email,
    //         hashedPassword
    //     );
    //     await AuthRepository.deleteVerificationToken(token);
    // }

    // static async loginWithOAuth(
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
