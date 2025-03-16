import { TokenVerificationType } from "@prisma/client";

export interface TokenVerificationData {
    id?: string;
    userId: string;
    email: string;
    token: string;
    type: TokenVerificationType;
    isUsed: boolean;
    expires: bigint;
}
