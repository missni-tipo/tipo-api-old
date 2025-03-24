import { PrismaClient, OAuthAccount } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { OAuthAccountData } from "../models/oAuthAccount.model";

const prisma = new PrismaClient();

export class BaseOAuthAccountRepository extends BaseRepository<OAuthAccount> {
    constructor() {
        super(prisma.oAuthAccount);
    }

    async findOAuthAccountByUserId(userId: string) {
        return await this.findOne({ userId: userId });
    }

    async findOAuthAccountById(id: string) {
        return await this.findOne({ id });
    }

    async createOAuthAccount(data: OAuthAccountData) {
        return await this.create({
            userId: data.userId,
            provider: data.provider,
            providerId: data.providerId,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        });
    }
}
