import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const saltAndHashPassword = async (
    password: string
): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};
