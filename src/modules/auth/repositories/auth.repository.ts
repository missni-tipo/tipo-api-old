import { PrismaClient } from "@prisma/client";
import { BaseSessionRepository } from "../../../shared/repositories/session.repository";
import { OAuthAccountData } from "../../../shared/models/oAuthAccount.model";
import { BaseOAuthAccountRepository } from "../../../shared/repositories/oAuthAccount.repository";
import { BaseVerificationTokenRepository } from "../../../shared/repositories/verificationToken.repository";
import { BaseUserRepository } from "../../../shared/repositories/user.repository";
import { VerificationTokenData } from "../../../shared/models/verificationToken.model";
import { UserData } from "../../../shared/models/user.model";
import { SessionData } from "../../../shared/models/session.model";
import { BaseUserRoleRepository } from "../../../shared/repositories/userRole.repository";
import { BaseRoleRepository } from "../../../shared/repositories/role.repository";
import { RoleData } from "../../../shared/models/role.model";
import { UserRoleData } from "../../../shared/models/userRole.mode";

const prisma = new PrismaClient();

export class AuthRepository {
    private sessionRepo: BaseSessionRepository;
    private oAuthAccountRepo: BaseOAuthAccountRepository;
    private verificationTokenRepo: BaseVerificationTokenRepository;
    private userRepo: BaseUserRepository;
    private userRoleRepo: BaseUserRoleRepository;
    private roleRepo: BaseRoleRepository;

    constructor() {
        this.sessionRepo = new BaseSessionRepository();
        this.oAuthAccountRepo = new BaseOAuthAccountRepository();
        this.verificationTokenRepo = new BaseVerificationTokenRepository();
        this.userRepo = new BaseUserRepository();
        this.userRoleRepo = new BaseUserRoleRepository();
        this.roleRepo = new BaseRoleRepository();
    }

    async findRoleById(id: string) {
        return await this.roleRepo.findRoleById(id);
    }

    async findRole(data: Partial<RoleData>) {
        return await this.roleRepo.findRole(data);
    }

    async findUserById(id: string) {
        return await this.userRepo.findUserById(id);
    }

    async findUserEmail(email: string) {
        return await this.userRepo.findUserByEmail(email);
    }

    async createUser(data: Partial<UserData>) {
        return await this.userRepo.createUser(data);
    }

    async updatePassword(id: string, data: Partial<UserData>) {
        return await this.userRepo.updateUser(id, data);
    }

    async findUserRole(userId: string) {
        return await this.userRoleRepo.findUserRoleByUserId({
            userId,
        });
    }

    async createUserRole(data: Partial<UserRoleData>) {
        return await this.userRoleRepo.createUserRole({
            userId: data.userId,
            roleId: data.roleId,
        });
    }

    async createSession(data: SessionData) {
        return await this.sessionRepo.createSession(data);
    }

    async deleteSession(refreshToken: string) {
        return await this.sessionRepo.deleteSession(refreshToken);
    }

    async createOAuthAccount(data: OAuthAccountData) {
        return await this.oAuthAccountRepo.createOAuthAccount(data);
    }

    async findVerificationToken(data: Partial<VerificationTokenData>) {
        return await this.verificationTokenRepo.findVerificationToken(data);
    }

    async createVerificationToken(data: VerificationTokenData) {
        return await this.verificationTokenRepo.createVerificationToken(data);
    }

    async updateVerificationToken(
        email: string,
        data: Partial<VerificationTokenData>
    ) {
        return await this.verificationTokenRepo.updateVerificationToken(
            email,
            data
        );
    }

    async deleteVerificationToken(token: string) {
        return await this.verificationTokenRepo.deleteVerificationToken(token);
    }
}
