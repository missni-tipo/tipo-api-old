import { Request, Response } from "express";
import { GetUserDto, UpdatePinDto, UpdateUserDto } from "../dtos/user.dto";
import { UserService } from "../services/user.service";

export class UserController {
    constructor(private userService: UserService) {}

    async getUser(req: Request, res: Response) {
        const { id }: GetUserDto = req.params as { id: string };

        const profile = await this.userService.getUser(id);

        res.status(201).json({
            status: true,
            message: "Get User Successful",
            data: { profile },
        });
    }

    async updateUser(req: Request, res: Response) {
        const { id }: GetUserDto = req.params as { id: string };

        const profileData: UpdateUserDto = req.body;

        const profile = await this.userService.updateUser(id, profileData);

        res.status(201).json({
            status: true,
            message: "Update User Successful",
            data: { profile },
        });
    }

    async updatePin(req: Request, res: Response) {
        const { id, newPin, oldPin }: UpdatePinDto = req.body;

        await this.userService.updatePin(id, newPin, oldPin);

        res.status(201).json({
            status: true,
            message: "Update PIN Successful",
        });
    }

    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;

        await this.userService.deleteUser(id);

        res.status(200).json({
            status: true,
            message: "User successfully deactivated",
        });
    }

    async reactivateUser(req: Request, res: Response) {
        const { id } = req.params;

        await this.userService.reactivateUser(id);

        res.status(200).json({
            status: true,
            message: "User successfully reactivated",
        });
    }
}
