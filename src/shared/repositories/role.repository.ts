import { PrismaClient, Role } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { RoleData } from "../models/role.model";

const prisma = new PrismaClient();

export class BaseRoleRepository extends BaseRepository<Role> {
    constructor() {
        super(prisma.role);
    }

    async findRole(data: Partial<RoleData>) {
        return await this.findOne(data);
    }

    async findRoleById(id: string) {
        return await this.findById(id);
    }

    async findRoles(data: Partial<RoleData>) {
        return await this.findMany(data);
    }

    async createRole(data: Partial<RoleData>) {
        return await this.create(data);
    }

    async updateRole(id: string, data: Partial<RoleData>) {
        return await this.updateById(id, data);
    }
}
