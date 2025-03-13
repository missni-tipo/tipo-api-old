import { PrismaClient, Session } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { SessionData } from "../models/session.model";

const prisma = new PrismaClient();

export class BaseSessionRepository extends BaseRepository<Session> {
    constructor() {
        super(prisma.session);
    }

    async findSessionById(id: string) {
        return await this.findById(id);
    }

    async createSession(data: SessionData) {
        return await this.create({
            userId: data.userId,
            refreshToken: data.refreshToken,
            userAgent: data.userAgent,
            ipAddress: data.ip,
            expiresAt: BigInt(data.expires),
        });
    }

    async deleteSession(refreshToken: string) {
        return await this.delete({ refreshToken: refreshToken });
    }
}
