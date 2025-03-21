import { Status } from "@prisma/client";
import { ApiError } from "../../../middlewares/error.middleware";
import { RoleData } from "../../../shared/models/role.model";
import { RoleRepository } from "../repositories/role.repository";

export class RoleService {
    private roleRepo: RoleRepository;

    constructor(roleRepo: RoleRepository) {
        this.roleRepo = roleRepo;
    }

    async roleNameChecking(name: string) {
        const roleChecking = await this.getRoleByName(name);
        if (roleChecking) throw new ApiError(400, "Role name already exists");
    }

    async getRole(id: string) {
        const role = this.roleRepo.findRoleByID(id);
        if (!role) throw new ApiError(404, "Role Not Found");
        return role;
    }

    async getRoleByName(name: string) {
        const role = this.roleRepo.findRoleByName(name);
        if (!role) throw new ApiError(404, "Role Not Found");
        return role;
    }

    async createRole(data: Partial<RoleData>) {
        const name = data.name?.trim();
        if (!name) throw new ApiError(400, "Role name is required");

        await this.roleNameChecking(name);

        return this.roleRepo.createRole(data);
    }

    async updateRole(id: string, data: Partial<RoleData>) {
        await this.getRole(id);

        const name = data.name?.trim();
        if (!name) throw new ApiError(400, "Role name is required");

        await this.roleNameChecking(name);

        return await this.roleRepo.updateRole(id, data);
    }

    async deleteRole(id: string) {
        await this.getRole(id);

        return await this.roleRepo.deactiveRole(id);
    }

    async reactiveRole(id: string) {
        const role = await this.getRole(id);

        if (role?.status === Status.ACTIVE)
            throw new ApiError(400, "Role is already Active");

        return await this.roleRepo.reactiveRole(id);
    }
}
