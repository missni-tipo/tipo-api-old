import { Status } from "@prisma/client";

export interface RoleData {
    id: string;
    name: string;
    description?: string;
    status: Status;
}
