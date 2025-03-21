import { ApiError } from "../../../middlewares/error.middleware";
import { UserData } from "../../../shared/models/user.model";
import { hashValue, verifyHashedValue } from "../../../utils/hashing";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository();
    }

    async getUser(id: string): Promise<Partial<UserData> | null> {
        const user = await this.userRepo.findUserById(id);

        if (!user) throw new ApiError(404, "User Not Found");

        const profileData: Partial<UserData> = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            birthdate: user.birthdate,
            domicile: user.domicile,
            picture: user.picture,
            status: user.status,
            profileCompletedAt: user.profileCompletedAt,
        };

        return profileData;
    }

    async updateUser(
        id: string,
        data: Partial<UserData>
    ): Promise<Partial<UserData>> {
        const user = await this.userRepo.findUserById(id);

        console.log(user);
        if (!user) throw new ApiError(404, "User Not Found");

        await this.userRepo.updateUsers(id, {
            ...data,
            birthdate: data.birthdate ? new Date(data.birthdate) : null,
            profileCompletedAt: BigInt(Date.now()),
        });

        return { id, ...data };
    }

    async updatePin(
        id: string,
        newPin: string,
        oldPin?: string
    ): Promise<boolean> {
        const user = await this.userRepo.findUserById(id);
        if (!user) throw new ApiError(404, "User Not Found");

        if (user.pinHash) {
            if (!oldPin) {
                throw new ApiError(400, "Old PIN is required");
            }

            const isOldPinValid = await verifyHashedValue(oldPin, user.pinHash);
            if (!isOldPinValid) {
                throw new ApiError(400, "The old PIN you entered is incorrect");
            }
        }

        const hashedPin = await hashValue(newPin);
        await this.userRepo.updateUsers(id, { pinHash: hashedPin });

        return true;
    }

    async deleteUser(id: string): Promise<boolean> {
        const user = await this.userRepo.findUserById(id);
        if (!user) throw new ApiError(404, "User Not Found");

        return await this.userRepo.deactivateUser(id);
    }

    async reactivateUser(id: string): Promise<boolean> {
        const user = await this.userRepo.findUserById(id);
        if (!user) throw new ApiError(404, "User Not Found");

        if (user.status === "ACTIVE") {
            throw new ApiError(400, "User is already active");
        }

        return await this.userRepo.reactivateUser(id);
    }
}
