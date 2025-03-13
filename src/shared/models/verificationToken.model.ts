import { VerificationTokenType } from "@prisma/client";

export interface VerificationTokenData {
    id?: string;
    userId: string;
    email: string;
    token: string;
    type: VerificationTokenType;
    isUsed: boolean;
    expires: bigint;
}
