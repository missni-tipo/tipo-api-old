import { Status } from "@prisma/client";
import { UserData } from "../../../shared/models/user.model";
import { BaseUserRepository } from "../../../shared/repositories/user.repository";

export class UserRepository {
    private userRepo: BaseUserRepository;

    constructor() {
        this.userRepo = new BaseUserRepository();
    }

    async findUserById(id: string) {
        return await this.userRepo.findUserById(id);
    }

    async getUsers(filter: Record<string, string | number>, limit?: number) {
        return await this.userRepo.getUsers(filter, limit);
    }

    async updateUsers(id: string, data: Partial<UserData>) {
        return await this.userRepo.updateUser(id, data);
    }

    async deactivateUser(id: string): Promise<boolean> {
        const updatedUser = await this.userRepo.updateUser(id, {
            status: Status.INACTIVE,
        });

        return updatedUser ? true : false;
    }

    async reactivateUser(id: string): Promise<boolean> {
        const updatedUser = await this.userRepo.updateUser(id, {
            status: Status.ACTIVE,
        });

        return updatedUser ? true : false;
    }
}
