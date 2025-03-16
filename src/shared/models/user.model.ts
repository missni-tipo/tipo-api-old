import { Status } from "@prisma/client";

export interface UserData {
    id: string;
    fullName: string;
    gender: string | null;
    email: string;
    phoneNumber: string | null;
    passwordHash: string | null;
    pin: string | null;
    status: Status;
    picture: string | null;
    birthdate: Date | null;
    domicile: string | null;
    profileCompletedAt: bigint | null;
}
