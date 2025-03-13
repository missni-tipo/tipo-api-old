import { PrismaClient, UserRole } from "@prisma/client";
import { BaseRepository } from "./base.repository";

const prisma = new PrismaClient();

export class BaseUserRoleRepository extends BaseRepository<UserRole> {
    constructor() {
        super(prisma.userRole);
    }

    async findUserRoleById(id: string) {
        return await this.findById(id);
    }

    async createUserRole(userId: string, roleId: string) {
        return await this.create({
            userId: userId,
            roleId: roleId,
        });
    }
}
