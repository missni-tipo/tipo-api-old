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

    async createRole(name: string, description: string) {
        return await this.create({
            name,
            description,
        });
    }
}
