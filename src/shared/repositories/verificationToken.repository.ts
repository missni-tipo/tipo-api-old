import { PrismaClient, VerificationToken } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { VerificationTokenData } from "../models/verificationToken.model";
import { bigint } from "zod";

const prisma = new PrismaClient();

export class BaseVerificationTokenRepository extends BaseRepository<VerificationToken> {
    constructor() {
        super(prisma.verificationToken);
    }

    async findVerificationToken(data: Partial<VerificationTokenData>) {
        return await this.findOne(data);
    }

    async createVerificationToken(data: VerificationTokenData) {
        return await this.create({
            userId: data.userId,
            email: data.email,
            expires: BigInt(data.expires),
            type: data.type,
            token: data.token,
        });
    }

    async updateVerificationToken(
        email: string,
        data: Partial<VerificationTokenData>
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

    async deleteVerificationToken(token: string) {
        return await this.delete({ token: token });
    }
}
