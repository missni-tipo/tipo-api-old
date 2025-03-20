import { Status } from "@prisma/client";
import { RoleData } from "../../../shared/models/role.model";
import { BaseRoleRepository } from "../../../shared/repositories/role.repository";

export class RoleRepository {
    private roleRepo: BaseRoleRepository;

    constructor(roleRepo: BaseRoleRepository) {
        this.roleRepo = roleRepo;
    }

    async findRoleByID(id: string) {
        return await this.roleRepo.findRoleById(id);
    }

    async findRoleByName(name: string) {
        return await this.roleRepo.findRole({ name });
    }

    async getRoles(data: Partial<RoleData>) {
        return await this.roleRepo.findRoles(data);
    }

    async createRole(data: Partial<RoleData>) {
        return await this.roleRepo.createRole(data);
    }

    async updateRole(id: string, data: Partial<RoleData>) {
        return await this.roleRepo.updateRole(id, data);
    }

    async deactiveRole(id: string) {
        return await this.roleRepo.updateRole(id, { status: Status.INACTIVE });
    }

    async reactiveRole(id: string) {
        return await this.roleRepo.updateRole(id, { status: Status.ACTIVE });
    }
}
