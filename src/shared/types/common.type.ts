export type UserRoleType = "admin" | "customer" | "dev" | "guest";

export const ROLE_BASES: Exclude<UserRoleType, "guest">[] = [
    "admin",
    "customer",
    "dev",
];

export const ROLE_BASE_MAP = {
    ADMIN: "admin",
    CUSTOMER: "customer",
    DEV: "dev",
    GUEST: "guest",
} as const;
