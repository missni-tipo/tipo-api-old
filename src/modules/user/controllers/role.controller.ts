import { Status } from "@prisma/client";
import { Request, Response } from "express";
import { RoleService } from "../services/role.service";
import { CreateRoleDto, FindRoleDto } from "../dtos/role.dto";

export class RoleController {
    private roleService: RoleService;

    constructor(roleService: RoleService) {
        this.roleService = roleService;
    }

    async getRole(req: Request, res: Response) {
        const { id }: FindRoleDto = req.params;
        const role = await this.roleService.getRole(id);

        res.status(200).json({
            status: true,
            message: "Get Role Successful",
            data: role,
        });
    }

    async createRole(req: Request, res: Response) {
        const { name, description }: CreateRoleDto = req.body;
        const role = await this.roleService.createRole({
            name,
            description,
            status: Status.INACTIVE,
        });

        res.status(201).json({
            status: true,
            message: "Create Role Successful",
            data: role,
        });
    }

    async updateRole(req: Request, res: Response) {
        const { id }: FindRoleDto = req.params;
        const data: Partial<CreateRoleDto> = req.body;

        const updatedRole = await this.roleService.updateRole(id, data);

        res.status(200).json({
            status: true,
            message: "Update Role Successful",
            data: updatedRole,
        });
    }

    async deleteRole(req: Request, res: Response) {
        const { id }: FindRoleDto = req.params;

        await this.roleService.deleteRole(id);

        res.status(200).json({
            status: true,
            message: "Delete Role Successful",
        });
    }

    async reactiveRole(req: Request, res: Response) {
        const { id }: FindRoleDto = req.params;

        await this.roleService.reactiveRole(id);

        res.status(200).json({
            status: true,
            message: "Reactivate Role Successful",
        });
    }
}
