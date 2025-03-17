import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashValue = async (value: string): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(value, salt);
};

export const verifyHashedValue = async (
    plainValue: string,
    hashedValue: string
): Promise<boolean> => {
    if (!plainValue || !hashedValue) {
        throw new Error("Both plain value and hashed value are required.");
    }

    return bcrypt.compare(plainValue, hashedValue);
};
