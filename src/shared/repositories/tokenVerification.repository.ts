import { PrismaClient, TokenVerification } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { TokenVerificationData } from "../models/tokenVerification.model";

const prisma = new PrismaClient();

export class BaseTokenVerificationRepository extends BaseRepository<TokenVerification> {
    constructor() {
        super(prisma.tokenVerification);
    }

    async findTokenVerification(data: Partial<TokenVerificationData>) {
        return await this.findOne(data);
    }

    async createTokenVerification(data: TokenVerificationData) {
        return await this.create({
            userId: data.userId,
            email: data.email,
            expires: BigInt(data.expires),
            type: data.type,
            token: data.token,
        });
    }

    async updateTokenVerification(
        email: string,
        data: Partial<TokenVerificationData>
    ) {
        return await this.update(
            { email },
            {
                ...data,
                expires:
                    data.expires !== undefined
                        ? BigInt(data.expires)
                        : undefined,
            }
        );
    }

    async deleteTokenVerification(token: string) {
        return await this.delete({ token: token });
    }
}
