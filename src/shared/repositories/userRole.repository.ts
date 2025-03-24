import { PrismaClient, UserRole } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { UserRoleData } from "../models/userRole.mode";

const prisma = new PrismaClient();

export class BaseUserRoleRepository extends BaseRepository<UserRole> {
    constructor() {
        super(prisma.userRole);
    }

    async findUserRoleById(id: string) {
        return await this.findOne({ id });
    }

    async findUserRoleByUserId(data: Partial<UserRoleData>) {
        return await this.findOne({ userId: data.userId });
    }

    async createUserRole(data: Partial<UserRoleData>) {
        return await this.create({
            userId: data.userId,
            roleId: data.roleId,
        });
    }
}
