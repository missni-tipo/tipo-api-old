import { BaseSessionRepository } from "../../../shared/repositories/session.repository";
import { OAuthAccountData } from "../../../shared/models/oAuthAccount.model";
import { BaseOAuthAccountRepository } from "../../../shared/repositories/oAuthAccount.repository";
import { BaseTokenVerificationRepository } from "../../../shared/repositories/tokenVerification.repository";
import { BaseUserRepository } from "../../../shared/repositories/user.repository";
import { TokenVerificationData } from "../../../shared/models/tokenVerification.model";
import { UserData } from "../../../shared/models/user.model";
import { SessionData } from "../../../shared/models/session.model";
import { BaseUserRoleRepository } from "../../../shared/repositories/userRole.repository";
import { BaseRoleRepository } from "../../../shared/repositories/role.repository";
import { RoleData } from "../../../shared/models/role.model";
import { UserRoleData } from "../../../shared/models/userRole.mode";

export class AuthRepository {
    private sessionRepo: BaseSessionRepository;
    private oAuthAccountRepo: BaseOAuthAccountRepository;
    private tokenVerificationRepo: BaseTokenVerificationRepository;
    private userRepo: BaseUserRepository;
    private userRoleRepo: BaseUserRoleRepository;
    private roleRepo: BaseRoleRepository;

    constructor() {
        this.sessionRepo = new BaseSessionRepository();
        this.oAuthAccountRepo = new BaseOAuthAccountRepository();
        this.tokenVerificationRepo = new BaseTokenVerificationRepository();
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

    async findSession(data: Partial<SessionData>) {
        return await this.sessionRepo.findSessionByToken(data);
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

    async findTokenVerification(data: Partial<TokenVerificationData>) {
        return await this.tokenVerificationRepo.findTokenVerification(data);
    }

    async createTokenVerification(data: TokenVerificationData) {
        return await this.tokenVerificationRepo.createTokenVerification(data);
    }

    async updateTokenVerification(
        email: string,
        data: Partial<TokenVerificationData>
    ) {
        return await this.tokenVerificationRepo.updateTokenVerification(
            email,
            data
        );
    }

    async deleteTokenVerification(token: string) {
        return await this.tokenVerificationRepo.deleteTokenVerification(token);
    }
}
