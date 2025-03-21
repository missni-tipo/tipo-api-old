import { PrismaClient, User } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { UserData } from "../models/user.model";

const prisma = new PrismaClient();

export class BaseUserRepository extends BaseRepository<User> {
    constructor() {
        super(prisma.user);
    }

    async findUserByEmail(email: string) {
        return await this.findUnique("email", email);
    }

    async findUserById(id: string) {
        return await this.findById(id);
    }

    async getUsers(
        filter: Record<string, string | number> = {},
        limit?: number
    ): Promise<Partial<UserData>[] | null> {
        return this.findMany({
            where: filter,
            take: limit,
        });
    }

    async createUser(data: Partial<UserData>) {
        return await this.create(data);
    }

    async updateUser(id: string, data: Partial<UserData>) {
        return await this.updateById(id, data);
    }
}
